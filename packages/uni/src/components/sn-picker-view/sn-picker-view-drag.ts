/**
 * sn-picker-view-drag — the roller drag engine shared by `sn-picker-view` and
 * `sn-datetime-picker-view`.
 *
 * Both components render the same wheel from cross-end primitives
 * (`view` + `transform: translateY()`), so the gesture math lives here once
 * (AGENTS.md §32: components render, this module computes).
 *
 * ## Why the old inline implementation felt broken
 *
 * 1. **Release coordinate was read from the wrong touch list.** On
 *    `touchend` the DOM / mini-program `touches` array is *empty* (the finger
 *    is gone) and only `changedTouches` carries the point. The old
 *    `touches ?? changedTouches` read kept the empty array (an empty array is
 *    not nullish), fell through to `detail.y`, and finally returned `0` —
 *    so every release computed `delta = (0 − startY) × ratio` and snapped to
 *    a wild row. That is the "能滑动也不能精准控制要选择的项" bug.
 * 2. **The offset was re-based on the live selection.** With
 *    `immediateChange` every mid-drag commit moved `baseOffset`, while
 *    `dragDelta` kept growing from the touch origin — the wheel travelled
 *    twice per committed row and jittered. The engine now anchors the offset
 *    at `touchstart` and never re-bases during a gesture.
 * 3. **No momentum.** A quick flick travelled exactly the finger distance and
 *    rounded to the same row — it read as "滑不动". Velocity is now sampled
 *    over a sliding window and projected onto the release.
 * 4. **The px → rpx ratio was hard-coded to 2.** `1px = 2rpx` only holds on a
 *    375px viewport. The engine measures the rendered column once per
 *    gesture (H5 / App webview) and falls back to `750 / windowWidth`
 *    (mini-programs, where rpx is defined by the viewport width).
 *
 * ## Gesture containment
 *
 * The SFC binds `@touchmove.stop.prevent`: `.stop` compiles to
 * `catchtouchmove` on mini-programs (the page can no longer scroll the
 * gesture away) and `.prevent` blocks the native scroll on H5 / App. The
 * roller must therefore own the whole vertical gesture once a drag starts.
 *
 * ## Desktop H5: mouse + wheel (additive, AGENTS.md §112)
 *
 * A uni H5 page opened in a desktop browser has a mouse, and browsers do not
 * translate mouse drags into touch events — so a touch-only roller was dead on
 * the desktop. `bindMouseGestures(root)` adds the two missing inputs, browser
 * hosts only (`typeof document !== 'undefined'`; mini-programs never call it):
 *
 *   - **mouse drag** — `mousedown` on a column anchors the same drag core the
 *     touch path uses; `mousemove` / `mouseup` are tracked on `document` (a
 *     mouse gesture may travel anywhere in the page) and detached on release,
 *     unmount or window exit. Synthetic mouse events that follow a real touch
 *     (tap → mousedown/click) are suppressed via a timestamp window, so a
 *     touch never double-fires the drag.
 *   - **wheel** — one committed row per accumulated `deltaY` notch; `preventDefault`
 *     keeps the page from scrolling instead of the wheel. Disabled rows are
 *     skipped in the travel direction, exactly like a settle.
 *
 * ## Lifecycle (AGENTS.md §41 / §82)
 *
 * The touch path owns no listeners, no timers, no observers: drag state is
 * plain component state reset on `touchend` / `touchcancel` and dies with the
 * component. The mouse path owns document-level followers only while a drag is
 * running plus the two root listeners, all removed by the disposer the
 * component calls on unmount. Timing uses `Date.now()` reads only.
 */

import { ref, type Ref } from 'vue';

/** Viewport assumed when neither `uni` nor `window` reports a width (tests). */
const DEFAULT_VIEWPORT_WIDTH = 375;

/** Finger travel below this is a tap, not a drag. */
const DRAG_THRESHOLD_PX = 4;

/** Finger speed is averaged over at most this window. */
const VELOCITY_WINDOW_MS = 100;

/** Momentum horizon: projected extra travel = velocity × this. */
const FLING_DECAY_MS = 120;

/** A flick may never fling more than this many rows. */
const MAX_FLING_ROWS = 5;

/** Resistance applied when dragging past the first / last row. */
const EDGE_DAMPING = 0.35;

/** Settle animation: shortest, longest and per-row scaling. */
const SNAP_MIN_MS = 160;
const SNAP_MAX_MS = 320;
const SNAP_MS_PER_ROW = 40;

/** A velocity sample shorter than this is noise, not a flick. */
const MIN_SAMPLE_MS = 16;

/** mousedown within this window after a touch is the tap's synthetic mouse. */
const MOUSE_SUPPRESS_MS = 500;

/** Wheel: accumulated deltaY per committed row (≈ one notch ≈ 100px). */
const WHEEL_NOTCH_PX = 100;

/** Wheel accumulator resets after the wheel idles this long. */
const WHEEL_IDLE_MS = 200;

/** Loose shape of a touch point across uni-app / DOM events. */
interface TouchPointLike {
  identifier?: number;
  clientY?: number;
  pageY?: number;
}

/** Loose shape of the events the roller receives. */
interface TouchEventLike {
  touches?: TouchPointLike[] | null;
  changedTouches?: TouchPointLike[] | null;
  detail?: { y?: number } | null;
  currentTarget?: unknown;
  target?: unknown;
}

/** Host callbacks the roller component provides. */
export interface RollerDragOptions {
  /** Whole-roller disable flag. */
  isDisabled(): boolean;
  /** Row height in rpx (`itemHeight × 2`). */
  itemRpx(): number;
  /** Visible row count. */
  visibleCount(): number;
  /** Selected row index of a column. */
  indexOf(columnIndex: number): number;
  /** Row count of a column. */
  lengthOf(columnIndex: number): number;
  /** Whether a row may be selected (disabled rows are skipped on settle). */
  isRowDisabled(columnIndex: number, rowIndex: number): boolean;
  /** Emit `change` while dragging instead of only on release. */
  isImmediate(): boolean;
  /** Commit a settled row index. */
  commit(columnIndex: number, rowIndex: number): void;
  /** `pickstart` hook (fires on `touchstart`). */
  onStart(): void;
  /** `pickend` hook (fires on `touchend` / `touchcancel`). */
  onEnd(): void;
  /** Clock override for tests — defaults to `Date.now`. */
  now?: (() => number) | undefined;
}

/** What the roller component consumes from the engine. */
export interface RollerDragApi {
  /** Column currently being dragged (`null` = at rest). */
  readonly dragColumn: Ref<number | null>;
  /** True while a finger is down — the roller must not transition. */
  readonly isDragging: Ref<boolean>;
  /** Settle animation length for the last release, in ms. */
  readonly snapDurationMs: Ref<number>;
  /** Transform offset of one column, in rpx. */
  columnOffsetRpx(columnIndex: number): number;
  onTouchStart(event: Event, columnIndex: number): void;
  onTouchMove(event: Event, columnIndex: number): void;
  onTouchEnd(event: Event, columnIndex: number): void;
  onTouchCancel(columnIndex: number): void;
  /**
   * True right after a real drag. Uni re-fires `tap` on the `touchstart`
   * target when the finger lifts, which would override the row the drag just
   * settled — row taps must be ignored until the next gesture begins.
   */
  shouldIgnoreTap(): boolean;
  /**
   * Desktop H5 input (additive): mouse drag + wheel on the component root.
   *
   * Columns are located through their `data-snui-column="<index>"` attribute,
   * which the SFCs put on every column element. `HTMLElement` (not `Element`)
   * so the mouse / wheel listeners get their typed event maps. Returns a
   * disposer that the component calls on unmount (AGENTS.md §41).
   */
  bindMouseGestures(root: HTMLElement): () => void;
}

/** First non-empty touch list — `touchend` only populates `changedTouches`. */
function readTouchList(event: Event): TouchPointLike[] {
  const detail = event as unknown as TouchEventLike;
  if (detail.touches && detail.touches.length > 0) return detail.touches;
  if (detail.changedTouches && detail.changedTouches.length > 0) return detail.changedTouches;
  return [];
}

/** Vertical finger position, or `null` when the event carries none. */
function touchY(event: Event, identifier: number | null): number | null {
  const list = readTouchList(event);
  const point =
    identifier === null
      ? list[0]
      : (list.find((entry) => entry.identifier === identifier) ?? list[0]);
  if (point) {
    if (typeof point.clientY === 'number') return point.clientY;
    if (typeof point.pageY === 'number') return point.pageY;
  }
  const detail = (event as unknown as TouchEventLike).detail;
  if (detail && typeof detail.y === 'number') return detail.y;
  return null;
}

/** Viewport width in px — the basis of the rpx unit (750rpx = viewport). */
function viewportWidth(): number {
  const host = globalThis as {
    uni?: { getSystemInfoSync?: () => { windowWidth?: number } };
    innerWidth?: number;
  };
  const width = host.uni?.getSystemInfoSync?.()?.windowWidth;
  if (typeof width === 'number' && width > 0) return width;
  if (typeof host.innerWidth === 'number' && host.innerWidth > 0) return host.innerWidth;
  return DEFAULT_VIEWPORT_WIDTH;
}

export function createRollerDrag(options: RollerDragOptions): RollerDragApi {
  const dragColumn = ref<number | null>(null);
  const isDragging = ref(false);
  const snapDurationMs = ref(SNAP_MIN_MS);
  /** Damped drag offset from the anchored base, in rpx. */
  const dragDelta = ref(0);

  /** Selection and base offset captured at `touchstart` — never re-based. */
  let anchorIndex = 0;
  let anchorRpx = 0;
  let startY = 0;
  /** Rendered row height in px, measured once per gesture (H5 / App). */
  let rowHeightPx = 0;
  /** Furthest the finger travelled from the origin this gesture. */
  let movedPx = 0;
  /** Identifier of the tracked touch (`null` when events carry none). */
  let identifier: number | null = null;
  /** Sliding velocity window (px, ms). */
  let windowY = 0;
  let windowT = 0;
  let lastY = 0;
  let lastT = 0;

  /** `now()` of the last touch event — suppresses the tap's synthetic mouse. */
  let lastTouchAt = -Infinity;
  /** True while the running gesture comes from the mouse (not touch). */
  let isMouseGesture = false;
  /** Removes the document-level mouse followers; `null` when no mouse drag. */
  let detachMouseFollowers: (() => void) | null = null;
  /** Wheel accumulator (px) and its last event time. */
  let wheelAccumY = 0;
  let lastWheelAt = -Infinity;

  const now = options.now ?? ((): number => Date.now());

  /** rpx per finger px — measured geometry first, viewport ratio as fallback. */
  function rpxPerPixel(): number {
    const itemRpx = Math.max(options.itemRpx(), 1);
    if (rowHeightPx > 0) return itemRpx / rowHeightPx;
    return 750 / viewportWidth();
  }

  function baseOffsetRpx(columnIndex: number): number {
    const itemRpx = Math.max(options.itemRpx(), 1);
    const visible = Math.max(options.visibleCount(), 1);
    return ((visible - 1) / 2 - options.indexOf(columnIndex)) * itemRpx;
  }

  /**
   * Resistance past the ends: the wheel follows the finger with 35% strength
   * instead of stopping dead (which read as "stuck") or running away.
   */
  function dampDelta(rawRpx: number): number {
    const columnIndex = dragColumn.value;
    if (columnIndex === null) return rawRpx;
    const itemRpx = Math.max(options.itemRpx(), 1);
    const last = Math.max(options.lengthOf(columnIndex) - 1, 0);
    const maxDelta = anchorIndex * itemRpx;
    const minDelta = (anchorIndex - last) * itemRpx;
    if (rawRpx > maxDelta) return maxDelta + (rawRpx - maxDelta) * EDGE_DAMPING;
    if (rawRpx < minDelta) return minDelta + (rawRpx - minDelta) * EDGE_DAMPING;
    return rawRpx;
  }

  /** Nearest selectable row for a continuous offset; skips disabled rows. */
  function resolveRow(columnIndex: number, rawRpx: number): number {
    const itemRpx = Math.max(options.itemRpx(), 1);
    const length = options.lengthOf(columnIndex);
    if (length <= 0) return 0;
    const last = length - 1;
    const raw = anchorIndex - rawRpx / itemRpx;
    let row = Math.round(raw);
    if (row < 0) row = 0;
    if (row > last) row = last;
    if (!options.isRowDisabled(columnIndex, row)) return row;
    // Walk outward in the travel direction so the wheel never rests on a
    // row the user cannot select.
    const direction = raw >= anchorIndex ? 1 : -1;
    for (let step = 1; step <= last; step += 1) {
      const forward = row + step * direction;
      if (forward >= 0 && forward <= last && !options.isRowDisabled(columnIndex, forward)) {
        return forward;
      }
      const backward = row - step * direction;
      if (backward >= 0 && backward <= last && !options.isRowDisabled(columnIndex, backward)) {
        return backward;
      }
    }
    return row;
  }

  function settleDurationMs(rowIndex: number): number {
    const rows = Math.abs(rowIndex - anchorIndex);
    return Math.min(SNAP_MAX_MS, Math.max(SNAP_MIN_MS, SNAP_MIN_MS + rows * SNAP_MS_PER_ROW));
  }

  function resetSamples(y: number, time: number): void {
    windowY = y;
    windowT = time;
    lastY = y;
    lastT = time;
  }

  function trackSample(y: number, time: number): void {
    if (time - windowT > VELOCITY_WINDOW_MS) {
      // Keep the previous sample so the window always spans a real interval.
      windowY = lastY;
      windowT = lastT;
    }
    lastY = y;
    lastT = time;
  }

  /** px/ms over the sliding window — `0` when the finger paused. */
  function velocityPxPerMs(y: number, time: number): number {
    const dt = time - windowT;
    if (dt < MIN_SAMPLE_MS) return 0;
    return (y - windowY) / dt;
  }

  /** Projected extra travel of a flick, in rpx (sign follows the finger). */
  function flingRpx(y: number, time: number): number {
    const itemRpx = Math.max(options.itemRpx(), 1);
    const projected = velocityPxPerMs(y, time) * FLING_DECAY_MS * rpxPerPixel();
    const cap = itemRpx * MAX_FLING_ROWS;
    if (projected > cap) return cap;
    if (projected < -cap) return -cap;
    return projected;
  }

  /** Measure the rendered column once per gesture (H5 / App webview only). */
  function measureRowHeightPx(event: Event): number {
    const host = event as unknown as TouchEventLike;
    const node = (host.currentTarget ?? host.target) as {
      getBoundingClientRect?: () => { height?: number };
    } | null;
    const height =
      node && typeof node.getBoundingClientRect === 'function'
        ? node.getBoundingClientRect()?.height
        : undefined;
    const visible = Math.max(options.visibleCount(), 1);
    if (typeof height !== 'number' || height <= 0) return 0;
    return height / visible;
  }

  /** Anchor a gesture on a column — shared by the touch and mouse starts. */
  function beginDrag(columnIndex: number, y: number): void {
    dragColumn.value = columnIndex;
    anchorIndex = options.indexOf(columnIndex);
    anchorRpx = baseOffsetRpx(columnIndex);
    startY = y;
    movedPx = 0;
    dragDelta.value = 0;
    isDragging.value = true;
    resetSamples(y, now());
    options.onStart();
  }

  /** Track the pointer through a running gesture — shared move body. */
  function dragTo(y: number): void {
    const active = dragColumn.value;
    if (active === null) return;
    trackSample(y, now());
    movedPx = Math.max(movedPx, Math.abs(y - startY));
    dragDelta.value = dampDelta((y - startY) * rpxPerPixel());
    if (options.isImmediate()) {
      options.commit(active, resolveRow(active, dragDelta.value));
    }
  }

  /** Settle a released gesture — shared end body. */
  function settleDrag(y: number): void {
    const active = dragColumn.value;
    if (active === null) return;
    const time = now();
    trackSample(y, time);
    const rawDelta = (y - startY) * rpxPerPixel();
    movedPx = Math.max(movedPx, Math.abs(y - startY));
    const settledDelta = dampDelta(rawDelta);
    const drag = movedPx >= DRAG_THRESHOLD_PX;
    endGesture();
    if (drag && options.lengthOf(active) > 0) {
      const target = resolveRow(active, settledDelta + flingRpx(y, time));
      snapDurationMs.value = settleDurationMs(target);
      options.commit(active, target);
    }
    options.onEnd();
  }

  /** Reset the gesture state without committing. */
  function cancelDrag(): void {
    if (dragColumn.value === null) return;
    endGesture();
    options.onEnd();
  }

  function endGesture(): void {
    dragColumn.value = null;
    isDragging.value = false;
    dragDelta.value = 0;
    isMouseGesture = false;
    detachMouseFollowers?.();
    detachMouseFollowers = null;
  }

  function onTouchStart(event: Event, columnIndex: number): void {
    if (options.isDisabled()) return;
    if (dragColumn.value !== null) return;
    const list = readTouchList(event);
    // A second finger is a pinch, not a drag — keep the running gesture.
    if (list.length > 1) return;
    if (options.lengthOf(columnIndex) <= 0) return;
    const y = touchY(event, null);
    if (y === null) return;
    rowHeightPx = measureRowHeightPx(event);
    identifier = list[0]?.identifier ?? null;
    lastTouchAt = now();
    isMouseGesture = false;
    beginDrag(columnIndex, y);
  }

  function onTouchMove(event: Event, columnIndex: number): void {
    if (isMouseGesture) return;
    if (dragColumn.value !== columnIndex) return;
    const y = touchY(event, identifier);
    if (y === null) return;
    lastTouchAt = now();
    dragTo(y);
  }

  function onTouchEnd(event: Event, columnIndex: number): void {
    if (isMouseGesture) return;
    if (dragColumn.value === null) return;
    // `touchend` fires on the element that received `touchstart`; still read
    // the position from whichever column owns the gesture.
    const y = touchY(event, identifier) ?? lastY;
    lastTouchAt = now();
    settleDrag(y);
    void columnIndex;
  }

  function onTouchCancel(columnIndex: number): void {
    void columnIndex;
    if (isMouseGesture) return;
    if (dragColumn.value === null) return;
    // A system gesture stole the touch: settle back without committing.
    cancelDrag();
  }

  /* ── Desktop H5: mouse drag + wheel (additive) ─────────────────────────── */

  /** Column element + index for a DOM target, or null outside any column. */
  function columnOf(target: EventTarget | null): { el: Element; index: number } | null {
    if (!(target instanceof Element)) return null;
    const column = target.closest('[data-snui-column]');
    if (column === null) return null;
    // `Number(null)` is 0, so an absent/empty attribute must be rejected
    // before the numeric read.
    const raw = column.getAttribute('data-snui-column');
    if (raw === null || raw.trim() === '') return null;
    const index = Number(raw);
    if (!Number.isInteger(index) || index < 0) return null;
    return { el: column, index };
  }

  /**
   * Row `steps` away from `from`, skipping disabled rows in the travel
   * direction. Stops at the column bounds without moving.
   */
  function stepRow(columnIndex: number, from: number, steps: number): number {
    const last = Math.max(options.lengthOf(columnIndex) - 1, 0);
    const direction = steps > 0 ? 1 : -1;
    let row = from;
    let left = Math.abs(steps);
    while (left > 0) {
      row += direction;
      if (row < 0 || row > last) return from;
      if (!options.isRowDisabled(columnIndex, row)) left -= 1;
    }
    return row;
  }

  /**
   * Track the running mouse drag from `document`.
   *
   * `mouseleave` does not bubble, so a bubble-phase listener on `document`
   * only fires for the one that targets the document itself — the pointer
   * left the window. Crossing element boundaries inside the page fires on
   * those elements and never reaches this listener, so a drag that travels
   * across rows is not cancelled.
   */
  function attachMouseFollowers(): void {
    const onMove = (event: MouseEvent): void => dragTo(event.clientY);
    const onUp = (event: MouseEvent): void => settleDrag(event.clientY);
    const onLeaveWindow = (): void => cancelDrag();
    const onBlur = (): void => cancelDrag();
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeaveWindow);
    window.addEventListener('blur', onBlur);
    detachMouseFollowers = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeaveWindow);
      window.removeEventListener('blur', onBlur);
      detachMouseFollowers = null;
    };
  }

  function bindMouseGestures(root: HTMLElement): () => void {
    // Mini-programs have no document; the SFCs skip the call, but the guard
    // keeps a stray use in another host inert instead of crashing.
    if (typeof document === 'undefined') return () => {};

    const onMouseDown = (event: MouseEvent): void => {
      if (event.button !== 0) return;
      if (options.isDisabled()) return;
      if (dragColumn.value !== null) return;
      // The synthetic mouse events that follow a touch (tap → mousedown /
      // click) are the same gesture, not a new drag.
      if (now() - lastTouchAt < MOUSE_SUPPRESS_MS) return;
      const column = columnOf(event.target);
      if (column === null) return;
      if (options.lengthOf(column.index) <= 0) return;
      // Exact row height for this desktop zoom level, straight from the box.
      const rect = column.el.getBoundingClientRect();
      const visible = Math.max(options.visibleCount(), 1);
      rowHeightPx = rect.height > 0 ? rect.height / visible : 0;
      identifier = null;
      isMouseGesture = true;
      beginDrag(column.index, event.clientY);
      // A roller drag must not select page text along the way.
      event.preventDefault();
      attachMouseFollowers();
    };

    const onWheel = (event: WheelEvent): void => {
      if (event.defaultPrevented) return;
      if (options.isDisabled()) return;
      // A wheel notch while a drag is running would commit from a stale
      // anchor; the running gesture owns the column.
      if (dragColumn.value !== null) return;
      const column = columnOf(event.target);
      if (column === null) return;
      if (options.lengthOf(column.index) <= 0) return;
      // The wheel drives the roller; the page must not scroll under it.
      event.preventDefault();
      const time = now();
      if (time - lastWheelAt > WHEEL_IDLE_MS) wheelAccumY = 0;
      lastWheelAt = time;
      // Firefox reports lines, every other engine pixels.
      const lineScale = event.deltaMode === 1 ? 33 : 1;
      wheelAccumY += event.deltaY * lineScale;
      const rows = Math.trunc(wheelAccumY / WHEEL_NOTCH_PX);
      if (rows === 0) return;
      wheelAccumY -= rows * WHEEL_NOTCH_PX;
      const from = options.indexOf(column.index);
      const target = stepRow(column.index, from, rows);
      if (target === from) return;
      snapDurationMs.value = settleDurationMs(target);
      options.commit(column.index, target);
    };

    root.addEventListener('mousedown', onMouseDown);
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      root.removeEventListener('mousedown', onMouseDown);
      root.removeEventListener('wheel', onWheel);
      endGesture();
    };
  }

  return {
    dragColumn,
    isDragging,
    snapDurationMs,
    columnOffsetRpx(columnIndex: number): number {
      if (dragColumn.value !== columnIndex) return baseOffsetRpx(columnIndex);
      return anchorRpx + dragDelta.value;
    },
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    shouldIgnoreTap(): boolean {
      return movedPx >= DRAG_THRESHOLD_PX;
    },
    bindMouseGestures,
  };
}
