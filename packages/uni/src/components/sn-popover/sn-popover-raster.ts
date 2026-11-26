/**
 * sn-popover mini-program chrome rasterizer.
 *
 * WeChat `<image>` does not decode SVG documents and inline `<svg>` renders
 * as an unknown tag (sn-icon AUI-MP-002/003, device-verified), so the chrome
 * silhouette rasterizes onto a 2d canvas and exports a **PNG** data URL:
 *
 * 1. `uni.createOffscreenCanvas({ type: '2d' })` — synchronous, no node
 *    (classic MP path, sn-icon precedent);
 * 2. `uni.createCanvasContextAsync({ id, component })` — uni-app x MP only,
 *    needs an in-template `<canvas>` node (sn-icon precedent);
 * 3. W3C `getContext('2d')` on a real element — H5 / docs / tests fallback.
 *
 * Path interpretation reuses the sn-icon interpreter (`tokenizePath` /
 * `drawPathOnCanvas` from sn-icon-mp-raster) — M/L/H/V/C/S/Q/T/A/Z supported,
 * and the chrome path only emits M/L/A/Z, inside that surface.
 *
 * Every failure returns `null` — the caller keeps the CSS paint
 * (two-line form) so a broken canvas host degrades instead of erasing the
 * bubble.
 */

import { drawPathOnCanvas, type RasterCanvas2d } from '../sn-icon/sn-icon-mp-raster';
import { resolveUniHost } from '../../utils/uni-host';
import { buildChromeSvgDoc, type ChromeGeometry, type ChromePaint } from './sn-popover-chrome';

interface OffscreenHost {
  createOffscreenCanvas?(options: { type: string; width: number; height: number }): {
    getContext(kind: '2d'): RasterCanvas2d | undefined;
    toDataURL(type?: string): string;
  };
}

interface AsyncCanvasHolder {
  getContext?(kind: string): unknown;
  toDataURL?: () => string;
}

/** The resolved chrome bitmap for an `<image>` node. */
export interface ChromeRaster {
  /** PNG data URL (mini-programs) or SVG document data URL (uni-app x App). */
  url: string;
  /** CSS box size in px (the raster's logical footprint). */
  width: number;
  height: number;
}

/**
 * Rasterize the chrome geometry at 2× device pixels (the `<image>` scales
 * back down; sn-icon's crispness rule) and export a PNG data URL.
 * Synchronous offscreen path; `null` when the host has no offscreen canvas.
 */
export function rasterizeChromePng(
  geometry: ChromeGeometry,
  paint: ChromePaint,
  sizePx: number,
): string | null {
  try {
    const host = resolveUniHost<OffscreenHost>();
    const factory = host?.createOffscreenCanvas;
    if (typeof factory !== 'function') return null;
    const canvas = factory({ type: '2d', width: sizePx, height: sizePx });
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(sizePx / geometry.box.width, sizePx / geometry.box.height);
    paintChromeOnContext(ctx, geometry, paint);
    const url = canvas.toDataURL('image/png');
    return typeof url === 'string' && url.startsWith('data:image/png') ? url : null;
  } catch {
    return null;
  }
}

/**
 * The uni-app x MP node path: draw on a `createCanvasContextAsync` context
 * and export through the holder's `toDataURL`. Returns `null` when the
 * holder carries no 2d context or the export is not a PNG.
 */
export function rasterizeChromePngOnHolder(
  holder: AsyncCanvasHolder,
  geometry: ChromeGeometry,
  paint: ChromePaint,
  sizePx: number,
): string | null {
  try {
    if (typeof holder.getContext !== 'function') return null;
    const context = holder.getContext('2d');
    if (!context || typeof context !== 'object') return null;
    const ctx = context as RasterCanvas2d;
    // Resize the backing bitmap when the host exposes the canvas element
    // (sn-icon pattern); a stale bitmap clips the path.
    const element = (ctx as unknown as { canvas?: { width: number; height: number } }).canvas;
    if (element && typeof element.width === 'number') {
      element.width = sizePx;
      element.height = sizePx;
    }
    ctx.scale(sizePx / geometry.box.width, sizePx / geometry.box.height);
    paintChromeOnContext(ctx, geometry, paint);
    const url = holder.toDataURL?.() ?? '';
    return url.startsWith('data:image/png') ? url : null;
  } catch {
    return null;
  }
}

/**
 * uni-app x App channel: the SVG document as a data URL (utf8 +
 * encodeURIComponent — sn-circle precedent). The document carries plain
 * path geometry with baked colors, inside the decoder constraints the uni-x
 * port verified (no transform, no dasharray, explicit intrinsic size).
 */
export function buildChromeRasterUrl(geometry: ChromeGeometry, paint: ChromePaint): string {
  const doc = buildChromeSvgDoc(geometry, paint);
  return `data:image/svg+xml;utf8,${encodeURIComponent(doc)}`;
}

/** Fill + optional stroke through the shared path interpreter. */
function paintChromeOnContext(
  ctx: RasterCanvas2d,
  geometry: ChromeGeometry,
  paint: ChromePaint,
): void {
  const hasStroke = paint.stroke !== '' && paint.stroke !== 'transparent';
  ctx.fillStyle = paint.fill;
  ctx.beginPath();
  drawPathOnCanvas(ctx, geometry.path);
  ctx.fill();
  if (hasStroke && paint.strokeWidth > 0) {
    ctx.strokeStyle = paint.stroke;
    ctx.lineWidth = paint.strokeWidth;
    ctx.lineJoin = 'round';
    ctx.stroke();
  }
}
