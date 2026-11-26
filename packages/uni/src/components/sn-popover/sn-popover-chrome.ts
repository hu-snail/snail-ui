/**
 * sn-popover chrome geometry — the bubble silhouette as ONE SVG path.
 *
 * The card (rounded rect) and the arrow merge into a single continuous
 * outline: there is no seam to composite, no rotated-diamond view to align,
 * and the border stroke follows the true silhouette including the arrow
 * flanks. This kills the whole class of arrow-junction rendering bugs the
 * CSS diamond accumulated (eight arrow-fix commits before this module).
 *
 * Consumers:
 *   - H5 / classic App (webview): inline `<svg><path :d>` (sn-icon H5 branch
 *     precedent) — crisp at any DPR, repaints for free.
 *   - mini-programs: the path rasterizes onto a canvas and exports a PNG data
 *     URL for `<image>` (WeChat `<image>` does not decode SVG documents and
 *     inline `<svg>` renders as an unknown tag — sn-icon AUI-MP-002/003).
 *   - uni-app x App: the full SVG document (buildChromeSvgDoc) feeds
 *     `<image>` as a data URL, inside the decoder constraints the uni-x port
 *     verified with sn-circle: plain path geometry only, no transform /
 *     dasharray, explicit width/height.
 *
 * Colors are baked by the caller (resolved concrete values, never var()) —
 * the silhouette carries no CSS dependency, so the MP custom-property chain
 * fragility (transparent bubble class of bugs) cannot reach the chrome.
 *
 * All inputs/outputs are device px; callers convert rpx tokens once.
 */

/** The 12 wd-popover placements (mirrors the SFC's prop union). */
export type ChromePlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** Arrow shape, device px. The diamond look is base ≈ 2 × protrusion. */
export interface ChromeArrowSpec {
  /** Distance the tip pokes out of the card edge. */
  protrusion: number;
  /** Base width along the card edge. */
  base: number;
}

export interface ChromeGeometryInput {
  /** Bubble (card) box, device px. */
  width: number;
  height: number;
  placement: ChromePlacement;
  arrow: ChromeArrowSpec;
  /**
   * Arrow tip position along the anchored edge, px from the edge start —
   * the fixed layer's trigger projection. `null` falls back to the
   * placement anchor (center, or `arrowInset` for -start / -end).
   */
  arrowCenter?: number | null;
  /** -start / -end anchor distance from the near corner, px. */
  arrowInset: number;
  /** Corner radius, px (kept in sync with the card's border-radius). */
  radius: number;
  /** Border stroke width, px — the box is padded so the stroke never clips. */
  strokeWidth: number;
}

/** Chrome layer box, device px, positioned relative to the bubble box. */
export interface ChromeBox {
  width: number;
  height: number;
  /** Chrome-box top relative to the bubble-box top (≤ 0 when it extends up). */
  offsetTop: number;
  /** Chrome-box left relative to the bubble-box left (≤ 0 when it extends left). */
  offsetLeft: number;
}

export interface ChromeGeometry {
  /** Single-silhouette path in chrome-box coordinates. */
  path: string;
  box: ChromeBox;
}

/** The card edge the arrow protrudes from, for a placement family. */
function arrowSideOf(placement: ChromePlacement): 'top' | 'bottom' | 'left' | 'right' {
  const family = placement.split('-')[0];
  if (family === 'top') return 'bottom';
  if (family === 'bottom') return 'top';
  if (family === 'left') return 'right';
  return 'left';
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function num(value: number): string {
  return String(round2(value));
}

/**
 * Build the single-silhouette chrome path. Deterministic and pure:
 * identical inputs always produce the identical path string, and the
 * arrow tip position is clamped so the base never overlaps a corner arc.
 * Returns `null` for a degenerate box (unmeasured / zero-size bubble) —
 * callers then skip the chrome layer entirely.
 */
export function buildBubbleChrome(input: ChromeGeometryInput): ChromeGeometry | null {
  const { width, height, arrow, strokeWidth } = input;
  if (!(width > 0) || !(height > 0)) return null;

  // Corner radius mirrors the card's border-radius but can never exceed half
  // the box (CSS clamps the same way).
  const radius = Math.max(0, Math.min(input.radius, Math.min(width, height) / 2));
  // Pad so the centered stroke (width/2 out) stays inside the chrome box.
  const pad = Math.max(0, strokeWidth / 2);

  const side = arrowSideOf(input.placement);
  const horizontal = side === 'top' || side === 'bottom';
  const sideLength = horizontal ? width : height;

  const box: ChromeBox = {
    width: horizontal ? width + pad * 2 : width + arrow.protrusion + pad * 2,
    height: horizontal ? height + arrow.protrusion + pad * 2 : height + pad * 2,
    // The chrome box extends past the bubble only on the arrow side (plus the
    // stroke pad everywhere), so it is positioned negatively against that side.
    offsetTop: side === 'top' ? -arrow.protrusion - pad : -pad,
    offsetLeft: side === 'left' ? -arrow.protrusion - pad : -pad,
  };
  // Bubble rect inside the chrome box: shifted away from the arrow side so
  // the protrusion has room, inset by the stroke pad everywhere else.
  const bx = side === 'left' ? arrow.protrusion + pad : pad;
  const by = side === 'top' ? arrow.protrusion + pad : pad;
  const x0 = bx;
  const y0 = by;
  const x1 = bx + width;
  const y1 = by + height;

  // Arrow base clamped inside the straight edge segments (never over a
  // corner arc); drop the arrow when the side is too short to hold it.
  const baseHalf = arrow.base / 2;
  const minCenter = radius + baseHalf;
  const maxCenter = sideLength - radius - baseHalf;
  const hasArrow = minCenter <= maxCenter;
  const defaultCenter = input.placement.endsWith('-start')
    ? Math.min(input.arrowInset, sideLength / 2)
    : input.placement.endsWith('-end')
      ? Math.max(sideLength - input.arrowInset, sideLength / 2)
      : sideLength / 2;
  const center = hasArrow
    ? Math.min(Math.max(input.arrowCenter ?? defaultCenter, minCenter), maxCenter)
    : 0;

  // Rounded-rect traversal, clockwise, with the arrow spliced into its edge.
  // Corners are true circular arcs (A rx ry 0 0 1 …) — the canvas interpreter
  // maps ratio-equal arcs onto ctx.arc and the uni-x App decoder accepts
  // precomputed-endpoint arcs (sn-circle precedent).
  const parts: string[] = [];
  const corner = (x: number, y: number): void => {
    parts.push(`A ${num(radius)} ${num(radius)} 0 0 1 ${num(x)} ${num(y)}`);
  };

  // Start: top-left corner end.
  parts.push(`M ${num(x0 + radius)} ${num(y0)}`);
  // Top edge (L→R), arrow when side === 'top' (protrudes upward).
  if (side === 'top' && hasArrow) {
    parts.push(`L ${num(x0 + center - baseHalf)} ${num(y0)}`);
    parts.push(`L ${num(x0 + center)} ${num(y0 - arrow.protrusion)}`);
    parts.push(`L ${num(x0 + center + baseHalf)} ${num(y0)}`);
    parts.push(`L ${num(x1 - radius)} ${num(y0)}`);
  } else {
    parts.push(`L ${num(x1 - radius)} ${num(y0)}`);
  }
  corner(x1, y0 + radius);
  // Right edge (T→B), arrow when side === 'right' (protrudes right).
  if (side === 'right' && hasArrow) {
    parts.push(`L ${num(x1)} ${num(y0 + center - baseHalf)}`);
    parts.push(`L ${num(x1 + arrow.protrusion)} ${num(y0 + center)}`);
    parts.push(`L ${num(x1)} ${num(y0 + center + baseHalf)}`);
    parts.push(`L ${num(x1)} ${num(y1 - radius)}`);
  } else {
    parts.push(`L ${num(x1)} ${num(y1 - radius)}`);
  }
  corner(x1 - radius, y1);
  // Bottom edge (R→L), arrow when side === 'bottom' (protrudes down).
  if (side === 'bottom' && hasArrow) {
    parts.push(`L ${num(x0 + center + baseHalf)} ${num(y1)}`);
    parts.push(`L ${num(x0 + center)} ${num(y1 + arrow.protrusion)}`);
    parts.push(`L ${num(x0 + center - baseHalf)} ${num(y1)}`);
    parts.push(`L ${num(x0 + radius)} ${num(y1)}`);
  } else {
    parts.push(`L ${num(x0 + radius)} ${num(y1)}`);
  }
  corner(x0, y1 - radius);
  // Left edge (B→T), arrow when side === 'left' (protrudes left).
  if (side === 'left' && hasArrow) {
    parts.push(`L ${num(x0)} ${num(y0 + center + baseHalf)}`);
    parts.push(`L ${num(x0 - arrow.protrusion)} ${num(y0 + center)}`);
    parts.push(`L ${num(x0)} ${num(y0 + center - baseHalf)}`);
    parts.push(`L ${num(x0)} ${num(y0 + radius)}`);
  } else {
    parts.push(`L ${num(x0)} ${num(y0 + radius)}`);
  }
  corner(x0 + radius, y0);
  parts.push('Z');

  return { path: parts.join(' '), box };
}

export interface ChromePaint {
  /** Concrete resolved colors — never var() (see the module header). */
  fill: string;
  /** Card outline color; `transparent` / empty skips the stroke attributes. */
  stroke: string;
  strokeWidth: number;
}

/**
 * Full SVG document for the uni-app x App `<image>` channel. Explicit
 * width/height + viewBox (a missing intrinsic box rasterizes at 300×150 on
 * some engines), plain path geometry only — inside the decoder constraints
 * the uni-x port verified with sn-circle.
 */
export function buildChromeSvgDoc(
  geometry: ChromeGeometry,
  paint: ChromePaint,
): string {
  const strokeAttrs =
    paint.stroke !== '' && paint.stroke !== 'transparent'
      ? ` stroke="${paint.stroke}" stroke-width="${num(paint.strokeWidth)}" stroke-linejoin="round"`
      : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(geometry.box.width)} ${num(geometry.box.height)}"` +
    ` width="${num(geometry.box.width)}" height="${num(geometry.box.height)}">` +
    `<path d="${geometry.path}" fill="${paint.fill}"${strokeAttrs}/></svg>`
  );
}
