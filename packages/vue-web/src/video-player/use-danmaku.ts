/**
 * SnVideoPlayer — canvas danmaku (bullet comment) engine.
 *
 * Design goals, benchmarked against mainstream players (B 站 / 西瓜):
 *   - ONE canvas + ONE rAF loop for the whole stream — per-danmu DOM nodes
 *     cannot keep up with hundreds of concurrent bullets.
 *   - Time-anchored scheduling: items carry `time` (media seconds); the
 *     engine owns a pointer into the sorted list and spawns each item when
 *     the media clock crosses it, so seeking forward/backward is exact.
 *   - Same-speed lane model: every scroll danmu moves at the same pixel
 *     velocity, so a lane is free iff the previous danmu's right edge has
 *     receded past the entry line (`now - spawnAt >= width / speed`). This
 *     is the standard collision-free condition for equal-speed bullets and
 *     needs only `{ spawnAt, width }` bookkeeping per lane.
 *
 * The render context may be `null` (happy-dom and other non-painting
 * environments): scheduling stays fully functional, drawing no-ops — which
 * is what makes the engine unit-testable without a real canvas.
 */

import type { SnDanmuType, SnVideoDanmu } from './video-player-types';

/** Options that may be changed live through `setOptions`. */
export interface DanmakuOptions {
  /** Global velocity multiplier (1 = crosses the canvas in `traverseSeconds`). */
  speed: number;
  /** Seconds for one danmu to cross the full canvas width. */
  traverseSeconds: number;
  /** 0–1. */
  opacity: number;
  /** Base font size in px at a 640px-wide canvas; scales with the canvas. */
  fontSize: number;
  /** Fraction of the canvas height usable for danmu lanes (0–1). */
  area: number;
}

export const DEFAULT_DANMAKU_OPTIONS: DanmakuOptions = {
  speed: 1,
  traverseSeconds: 9,
  opacity: 1,
  fontSize: 16,
  area: 0.75,
};

/** A spawn that is currently on (or entering) the canvas. */
interface ActiveDanmu {
  text: string;
  color: string;
  type: SnDanmuType;
  self: boolean;
  /** Left edge, css px (scroll); centered for top/bottom. */
  x: number;
  /** Baseline y, css px. */
  y: number;
  width: number;
  /** Performance-ms timestamp of the spawn. */
  spawnAt: number;
  /** Top/bottom lifetime (ms); scroll danmus despawn off-canvas instead. */
  life: number;
}

/** Per-lane bookkeeping for the equal-speed entry condition. */
export interface ScrollLaneTail {
  spawnAt: number;
  width: number;
}

/**
 * Pure lane-entry decision — exported for unit tests.
 *
 * A lane accepts a new danmu when the previous one's right edge has moved
 * past the entry line (canvas right edge). Equal speeds make this permanent.
 */
export function canEnterScrollLane(
  tail: ScrollLaneTail | undefined,
  nowMs: number,
  speedPxPerSec: number,
): boolean {
  if (!tail) return true;
  if (speedPxPerSec <= 0) return true;
  const elapsedSec = (nowMs - tail.spawnAt) / 1000;
  return elapsedSec * speedPxPerSec >= tail.width;
}

/** Sort by `time`, then by original order (stable for equal timestamps). */
export function sortDanmus(items: readonly SnVideoDanmu[]): SnVideoDanmu[] {
  return items
    .map((item, order) => ({ item, order }))
    .sort((a, b) => a.item.time - b.item.time || a.order - b.order)
    .map((entry) => entry.item);
}

/** First index whose `time` is >= `t` (binary search over sorted items). */
export function lowerBoundTime(items: readonly SnVideoDanmu[], t: number): number {
  let lo = 0;
  let hi = items.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    const item = items[mid];
    if (item && item.time < t) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** 2D-context surface the engine needs (subset of CanvasRenderingContext2D). */
export interface DanmakuCanvasContext {
  clearRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number): void;
  strokeText(text: string, x: number, y: number): void;
  measureText(text: string): { width: number };
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  set font(value: string);
  set fillStyle(value: string);
  set strokeStyle(value: string);
  set lineWidth(value: number);
  set globalAlpha(value: number);
  set textAlign(value: CanvasTextAlign);
  set textBaseline(value: CanvasTextBaseline);
  set shadowColor(value: string);
  set shadowBlur(value: number);
}

export interface DanmakuEngineHost {
  /** Media clock in seconds — drives scheduling. */
  getTime(): number;
  /** While true the danmu field freezes (dt is not consumed). */
  isPaused(): boolean;
}

/** Seconds a top/bottom danmu stays on screen. */
const FIXED_LIFE_MS = 4500;
/** Spawn window: items whose time passed more than this while paused/hidden are dropped. */
const SPAWN_WINDOW_SEC = 0.4;
/** Hard cap on concurrent danmus (protects the rAF budget). */
const MAX_ACTIVE = 120;

export class DanmakuEngine {
  private canvas: HTMLCanvasElement;
  private host: DanmakuEngineHost;
  private ctx: DanmakuCanvasContext | null;
  private options: DanmakuOptions = { ...DEFAULT_DANMAKU_OPTIONS };

  private items: SnVideoDanmu[] = [];
  private pointer = 0;
  private actives: ActiveDanmu[] = [];
  private scrollTails: Array<ScrollLaneTail | undefined> = [];

  private cssWidth = 0;
  private cssHeight = 0;
  private dpr = 1;
  private rafId: number | null = null;
  private lastFrameMs: number | null = null;
  private running = false;
  private destroyed = false;

  constructor(canvas: HTMLCanvasElement, host: DanmakuEngineHost) {
    this.canvas = canvas;
    this.host = host;
    this.ctx = canvas.getContext('2d') as DanmakuCanvasContext | null;
  }

  /* ── configuration ── */

  setOptions(partial: Partial<DanmakuOptions>): void {
    Object.assign(this.options, partial);
  }

  resize(cssWidth: number, cssHeight: number, dpr: number): void {
    this.cssWidth = cssWidth;
    this.cssHeight = cssHeight;
    this.dpr = dpr;
    if (this.ctx) {
      this.canvas.width = Math.max(1, Math.round(cssWidth * dpr));
      this.canvas.height = Math.max(1, Math.round(cssHeight * dpr));
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  /* ── timeline ── */

  /** Replace the whole danmu timeline and re-anchor to the media clock. */
  setItems(items: readonly SnVideoDanmu[]): void {
    this.items = sortDanmus(items);
    this.pointer = lowerBoundTime(this.items, this.host.getTime());
  }

  /** Re-anchor after a seek: drop on-screen danmus, jump the pointer. */
  seekTo(t: number): void {
    this.pointer = lowerBoundTime(this.items, t);
    this.actives = [];
    this.scrollTails = [];
  }

  /**
   * Send a danmu "as the current user": rendered immediately at the media
   * clock. Self danmus are ephemeral (not part of the timeline), so seeking
   * back does not replay them.
   */
  send(text: string, opts: { color?: string; type?: SnDanmuType } = {}): void {
    const trimmed = text.trim();
    if (!trimmed || this.destroyed) return;
    // Built with explicit assignment — under `exactOptionalPropertyTypes` a
    // literal with `color: opts.color` would carry explicit `undefined`s.
    const item: SnVideoDanmu = { text: trimmed, time: this.host.getTime(), self: true };
    if (opts.color !== undefined) item.color = opts.color;
    if (opts.type !== undefined) item.type = opts.type;
    this.activate(item, performance.now());
  }

  /** Danmus currently on (or entering) the canvas — exposed for tests. */
  get activeCount(): number {
    return this.actives.length;
  }

  /** Next unsent item's time — exposed for tests. */
  get nextItemTime(): number | null {
    const item = this.items[this.pointer];
    return item ? item.time : null;
  }

  /* ── frame loop ── */

  start(): void {
    if (this.running || this.destroyed) return;
    this.running = true;
    this.lastFrameMs = null;
    const loop = (nowMs: number): void => {
      if (!this.running) return;
      this.tick(nowMs);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.stop();
    this.actives = [];
    this.items = [];
  }

  /** One animation frame. Public so tests can drive time deterministically. */
  tick(nowMs: number): void {
    const last = this.lastFrameMs;
    this.lastFrameMs = nowMs;
    const dtSec = last === null ? 0 : Math.min(nowMs - last, 50) / 1000;
    const t = this.host.getTime();

    this.advancePointer(t, nowMs);
    if (!this.host.isPaused() && dtSec > 0) this.advance(dtSec, nowMs);
    this.draw();
  }

  /* ── internals ── */

  private advancePointer(t: number, nowMs: number): void {
    while (this.pointer < this.items.length) {
      const item = this.items[this.pointer];
      if (!item || item.time > t) break;
      // Missed while paused / hidden / tab-throttled: drop instead of bursting.
      if (t - item.time <= SPAWN_WINDOW_SEC) this.activate(item, nowMs);
      this.pointer++;
    }
  }

  private activate(item: SnVideoDanmu, nowMs: number): void {
    if (this.actives.length >= MAX_ACTIVE) return;
    const type = item.type ?? 'scroll';
    const fontPx = this.effectiveFontPx();
    if (type === 'scroll') {
      const width = this.measure(item.text, fontPx);
      const laneCount = this.scrollLaneCount();
      let lane = -1;
      for (let i = 0; i < laneCount; i++) {
        if (canEnterScrollLane(this.scrollTails[i], nowMs, this.speedPx())) {
          lane = i;
          break;
        }
      }
      if (lane < 0) return; // all lanes busy — drop (B 站 behaves the same)
      const laneHeight = this.laneHeightPx();
      this.scrollTails[lane] = { spawnAt: nowMs, width };
      this.actives.push({
        text: item.text,
        color: item.color ?? '#FFFFFF',
        type,
        self: item.self === true,
        x: this.cssWidth,
        y: lane * laneHeight + laneHeight / 2 + fontPx * 0.1,
        width,
        spawnAt: nowMs,
        life: 0,
      });
      return;
    }

    // top / bottom: stack from the edge; lane = current stack depth.
    const sameType = this.actives.filter((a) => a.type === type);
    const lane = sameType.length;
    const laneHeight = this.laneHeightPx();
    const y =
      type === 'top'
        ? lane * laneHeight + laneHeight / 2 + fontPx * 0.1
        : this.cssHeight - lane * laneHeight - laneHeight / 2 - fontPx * 0.1;
    // A 0-sized canvas (never resized — tests / hidden layer) schedules
    // without geometry, so the bounds check only applies once sized.
    if (this.cssHeight > 0 && (y < 0 || y > this.cssHeight)) return;
    this.actives.push({
      text: item.text,
      color: item.color ?? '#FFFFFF',
      type,
      self: item.self === true,
      x: this.cssWidth / 2,
      y: Math.min(y, this.cssHeight - laneHeight / 2),
      width: this.measure(item.text, fontPx),
      spawnAt: nowMs,
      life: FIXED_LIFE_MS,
    });
  }

  private advance(dtSec: number, nowMs: number): void {
    const v = this.speedPx();
    this.actives = this.actives.filter((a) => {
      if (a.type === 'scroll') {
        a.x -= v * dtSec;
        return a.x + a.width > 0;
      }
      return nowMs - a.spawnAt < a.life;
    });
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx || this.cssWidth <= 0) return;
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
    const fontPx = this.effectiveFontPx();
    ctx.font = `${fontPx}px system-ui, -apple-system, 'PingFang SC', sans-serif`;
    ctx.textAlign = this.cssWidth > 0 && this.actives.some((a) => a.type !== 'scroll')
      ? 'center'
      : 'left';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = this.options.opacity;
    ctx.lineWidth = 2;
    for (const a of this.actives) {
      ctx.fillStyle = a.color;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
      if (a.type === 'scroll') {
        ctx.textAlign = 'left';
        ctx.strokeText(a.text, a.x, a.y);
        ctx.fillText(a.text, a.x, a.y);
      } else {
        ctx.textAlign = 'center';
        if (a.self) {
          ctx.shadowColor = a.color;
          ctx.shadowBlur = 8;
        }
        ctx.strokeText(a.text, a.x, a.y);
        ctx.fillText(a.text, a.x, a.y);
        ctx.shadowBlur = 0;
      }
    }
    ctx.globalAlpha = 1;
  }

  private speedPx(): number {
    const seconds = Math.max(1, this.options.traverseSeconds / this.options.speed);
    return this.cssWidth / seconds;
  }

  private effectiveFontPx(): number {
    const scale = Math.min(2, Math.max(0.75, this.cssWidth / 640));
    return Math.round(this.options.fontSize * scale);
  }

  private laneHeightPx(): number {
    return Math.max(20, this.effectiveFontPx() * 1.4);
  }

  private scrollLaneCount(): number {
    const usable = Math.max(this.laneHeightPx(), this.cssHeight * this.options.area);
    return Math.max(1, Math.floor(usable / this.laneHeightPx()));
  }

  private measure(text: string, fontPx: number): number {
    const ctx = this.ctx;
    if (!ctx) return text.length * fontPx * 0.6;
    ctx.font = `${fontPx}px system-ui, -apple-system, 'PingFang SC', sans-serif`;
    return ctx.measureText(text).width;
  }
}
