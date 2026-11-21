/**
 * sn-icon mini-program canvas rasterizer (AUI-MP-003).
 *
 * WeChat's `<image>` does not decode `data:image/svg+xml` URLs, so the
 * SVG data-URL rasterization (AUI-MP-002) renders blank on real devices.
 * This module draws the IconData straight onto a 2d offscreen canvas and
 * exports a **PNG** data URL — a format WeChat's `<image>` always decodes.
 *
 * Scope: feather-style catalogs (24×24 viewBox, stroke rendering, round
 * caps) plus fill icons. Supported path commands: M L H V C S Q T A Z
 * (absolute + relative). Arcs use the standard endpoint→center conversion;
 * rx≈ry arcs map to `ctx.arc`, off-ratio arcs fall back to polyline
 * sampling (catalog icons are ratio-equal, so this is a safety net).
 *
 * Every failure path returns `null` — the caller falls back to the SVG
 * data URL, so a broken canvas host degrades instead of erasing the icon.
 */

import { resolveUniHost } from '../../utils/uni-host';
import type { IconData } from './sn-icon-types';

/** Minimal 2d canvas surface across uni hosts (classic + uni-app x MP). */
interface RasterCanvas2d {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: string;
  lineJoin: string;
  scale(x: number, y: number): void;
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  bezierCurveTo(a: number, b: number, c: number, d: number, e: number, f: number): void;
  quadraticCurveTo(a: number, b: number, c: number, d: number): void;
  arc(x: number, y: number, r: number, a0: number, a1: number, ccw?: boolean): void;
  closePath(): void;
  fill(): void;
  stroke(): void;
  toDataURL(type?: string): string;
}

interface RasterHost {
  createOffscreenCanvas?(options: { type: string; width: number; height: number }): {
    getContext(kind: '2d'): RasterCanvas2d | undefined;
    toDataURL(type?: string): string;
  };
}

/* ── path tokenizer ────────────────────────────────────────────────────── */

type PathToken = string | number;

/** @internal — exported for the interpreter unit tests. */
export function tokenizePath(d: string): PathToken[] {
  const out: PathToken[] = [];
  let i = 0;
  while (i < d.length) {
    const ch = d[i] as string;
    if (/[A-Za-z]/.test(ch)) {
      out.push(ch);
      i += 1;
      continue;
    }
    if (/[0-9.\-+]/.test(ch)) {
      let j = i + 1;
      while (j < d.length && /[0-9.]/.test(d[j] as string)) j += 1;
      const value = Number.parseFloat(d.slice(i, j));
      if (Number.isFinite(value)) out.push(value);
      i = j;
      continue;
    }
    i += 1; // whitespace / comma
  }
  return out;
}

/* ── arc endpoint→center conversion (SVG spec Appendix A) ─────────────── */

function drawArcSegment(
  ctx: RasterCanvas2d,
  x1: number,
  y1: number,
  rx0: number,
  ry0: number,
  phiDeg: number,
  largeArc: boolean,
  sweep: boolean,
  x2: number,
  y2: number,
): void {
  if (x1 === x2 && y1 === y2) return;
  const rx = Math.abs(rx0);
  const ry = Math.abs(ry0);
  if (rx === 0 || ry === 0) {
    ctx.lineTo(x2, y2);
    return;
  }
  const phi = (phiDeg * Math.PI) / 180;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const dx2 = (x1 - x2) / 2;
  const dy2 = (y1 - y2) / 2;
  const x1p = cosP * dx2 + sinP * dy2;
  const y1p = -sinP * dx2 + cosP * dy2;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  let rxAdj = rx;
  let ryAdj = ry;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rxAdj = rx * s;
    ryAdj = ry * s;
  }
  const sign = largeArc !== sweep ? 1 : -1;
  const numerator = rxAdj * rxAdj * ryAdj * ryAdj - rxAdj * rxAdj * y1p * y1p - ryAdj * ryAdj * x1p * x1p;
  const denominator = rxAdj * rxAdj * y1p * y1p + ryAdj * ryAdj * x1p * x1p;
  const co = (denominator === 0 ? 0 : sign * Math.sqrt(Math.max(numerator / denominator, 0)));
  // Center in the rotated (chord-midpoint) coordinate system — th1/dth must
  // stay in this same frame; the world-space center is converted at the end.
  const cxp = (co * rxAdj * y1p) / ryAdj;
  const cyp = (-co * ryAdj * x1p) / rxAdj;
  const angleOf = (ux: number, uy: number, vx: number, vy: number): number => {
    const dot = ux * vx + uy * vy;
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    const a = Math.acos(Math.min(1, Math.max(-1, len === 0 ? 1 : dot / len)));
    return ux * vy - uy * vx < 0 ? -a : a;
  };
  const th1 = angleOf(1, 0, (x1p - cxp) / rxAdj, (y1p - cyp) / ryAdj);
  let dth = angleOf((x1p - cxp) / rxAdj, (y1p - cyp) / ryAdj, (-x1p - cxp) / rxAdj, (-y1p - cyp) / ryAdj);
  if (!sweep && dth > 0) dth -= 2 * Math.PI;
  if (sweep && dth < 0) dth += 2 * Math.PI;
  // World-space center: rotate the frame back and shift to the chord midpoint.
  const wcX = cxp * cosP - cyp * sinP + (x1 + x2) / 2;
  const wcY = cxp * sinP + cyp * cosP + (y1 + y2) / 2;
  if (Math.abs(rxAdj - ryAdj) < 0.01) {
    // Ratio-equal arcs (the catalog norm) map straight onto ctx.arc.
    ctx.arc(wcX, wcY, rxAdj, th1, th1 + dth, !sweep);
    return;
  }
  // Off-ratio safety net: polyline sampling along the transformed ellipse.
  const steps = Math.max(2, Math.ceil((Math.abs(dth) / (Math.PI / 8))));
  for (let s2 = 1; s2 <= steps; s2 += 1) {
    const th = th1 + (dth * s2) / steps;
    ctx.lineTo(
      cosP * rxAdj * Math.cos(th) - sinP * ryAdj * Math.sin(th) + wcX,
      sinP * rxAdj * Math.cos(th) + cosP * ryAdj * Math.sin(th) + wcY,
    );
  }
}

/* ── path command interpreter ──────────────────────────────────────────── */

/** @internal — exported for the interpreter unit tests. */
export function drawPathOnCanvas(ctx: RasterCanvas2d, d: string): void {
  const tokens = tokenizePath(d);
  let i = 0;
  let cmd = '';
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let prevCx = 0;
  let prevCy = 0;
  let prevQx = 0;
  let prevQy = 0;
  const num = (): number => tokens[i++] as number;
  while (i < tokens.length) {
    const token = tokens[i];
    if (typeof token === 'string') {
      cmd = token;
      i += 1;
    }
    switch (cmd) {
      case 'M':
        cx = num();
        cy = num();
        ctx.moveTo(cx, cy);
        sx = cx;
        sy = cy;
        cmd = 'L';
        break;
      case 'm':
        cx += num();
        cy += num();
        ctx.moveTo(cx, cy);
        sx = cx;
        sy = cy;
        cmd = 'l';
        break;
      case 'L':
        cx = num();
        cy = num();
        ctx.lineTo(cx, cy);
        break;
      case 'l':
        cx += num();
        cy += num();
        ctx.lineTo(cx, cy);
        break;
      case 'H':
        cx = num();
        ctx.lineTo(cx, cy);
        break;
      case 'h':
        cx += num();
        ctx.lineTo(cx, cy);
        break;
      case 'V':
        cy = num();
        ctx.lineTo(cx, cy);
        break;
      case 'v':
        cy += num();
        ctx.lineTo(cx, cy);
        break;
      case 'C': {
        const x1 = num();
        const y1 = num();
        prevCx = num();
        prevCy = num();
        cx = num();
        cy = num();
        ctx.bezierCurveTo(x1, y1, prevCx, prevCy, cx, cy);
        break;
      }
      case 'c': {
        const x1 = cx + num();
        const y1 = cy + num();
        prevCx = cx + num();
        prevCy = cy + num();
        cx += num();
        cy += num();
        ctx.bezierCurveTo(x1, y1, prevCx, prevCy, cx, cy);
        break;
      }
      case 'S': {
        const x1 = 2 * cx - prevCx;
        const y1 = 2 * cy - prevCy;
        prevCx = num();
        prevCy = num();
        cx = num();
        cy = num();
        ctx.bezierCurveTo(x1, y1, prevCx, prevCy, cx, cy);
        break;
      }
      case 's': {
        const x1 = 2 * cx - prevCx;
        const y1 = 2 * cy - prevCy;
        prevCx = cx + num();
        prevCy = cy + num();
        cx += num();
        cy += num();
        ctx.bezierCurveTo(x1, y1, prevCx, prevCy, cx, cy);
        break;
      }
      case 'Q': {
        prevQx = num();
        prevQy = num();
        cx = num();
        cy = num();
        ctx.quadraticCurveTo(prevQx, prevQy, cx, cy);
        break;
      }
      case 'q': {
        prevQx = cx + num();
        prevQy = cy + num();
        cx += num();
        cy += num();
        ctx.quadraticCurveTo(prevQx, prevQy, cx, cy);
        break;
      }
      case 'T': {
        const qx = 2 * cx - prevQx;
        const qy = 2 * cy - prevQy;
        cx = num();
        cy = num();
        ctx.quadraticCurveTo(qx, qy, cx, cy);
        prevQx = qx;
        prevQy = qy;
        break;
      }
      case 't': {
        const qx = 2 * cx - prevQx;
        const qy = 2 * cy - prevQy;
        cx += num();
        cy += num();
        ctx.quadraticCurveTo(qx, qy, cx, cy);
        prevQx = qx;
        prevQy = qy;
        break;
      }
      case 'A': {
        const rx = num();
        const ry = num();
        const phi = num();
        const largeArc = num() !== 0;
        const sweep = num() !== 0;
        const x = num();
        const y = num();
        drawArcSegment(ctx, cx, cy, rx, ry, phi, largeArc, sweep, x, y);
        cx = x;
        cy = y;
        break;
      }
      case 'a': {
        const rx = num();
        const ry = num();
        const phi = num();
        const largeArc = num() !== 0;
        const sweep = num() !== 0;
        const x = cx + num();
        const y = cy + num();
        drawArcSegment(ctx, cx, cy, rx, ry, phi, largeArc, sweep, x, y);
        cx = x;
        cy = y;
        break;
      }
      case 'Z':
      case 'z':
        ctx.closePath();
        cx = sx;
        cy = sy;
        break;
      default:
        // Unknown command — skip it so a malformed path cannot loop forever.
        i += 1;
        break;
    }
  }
}

/* ── public rasterizer ─────────────────────────────────────────────────── */

/**
 * Draw `icon` onto an offscreen 2d canvas at `sizePx` physical pixels and
 * export a PNG data URL. Returns `null` when the host has no offscreen
 * canvas or anything throws — callers fall back to the SVG data URL.
 */
export function rasterizeIconDataUrl(
  icon: IconData,
  color: string,
  strokeWidth: number | string,
  sizePx: number,
): string | null {
  try {
    const host = resolveUniHost<RasterHost>();
    const factory = host?.createOffscreenCanvas;
    if (typeof factory !== 'function') return null;
    const canvas = factory({ type: '2d', width: sizePx, height: sizePx });
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const viewBox = (icon.viewBox ?? '0 0 24 24').split(/[\s,]+/).map(Number);
    const vw = viewBox[2] || 24;
    const vh = viewBox[3] || 24;
    ctx.scale(sizePx / vw, sizePx / vh);
    const isFill = icon.render === 'fill';
    if (isFill) {
      ctx.fillStyle = color;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = Number(strokeWidth) || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    for (const d of icon.paths) {
      ctx.beginPath();
      drawPathOnCanvas(ctx, d);
      if (isFill) ctx.fill();
      else ctx.stroke();
    }
    const url = canvas.toDataURL('image/png');
    return typeof url === 'string' && url.startsWith('data:image/png') ? url : null;
  } catch {
    return null;
  }
}
