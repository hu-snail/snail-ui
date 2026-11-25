/**
 * Viewport clamping for anchor-placed popover bubbles (MP real devices).
 *
 * A bubble anchored to a trigger near a screen edge (e.g. a bottom-centered
 * trigger in the rightmost column) hangs past the viewport and gets cut by
 * the screen — CSS cannot clamp a percent-centered absolute box. The shift
 * returned here is applied as an inline transform on the pop node, which
 * survives every renderer (no CSS var chains, no stylesheet conflicts: the
 * inline value folds the centering translate in).
 */

/** Edge padding: the bubble keeps this many px inside each viewport edge. */
export const VIEWPORT_MARGIN = 12;

export interface PopoverBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type PopoverFamily = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverShift {
  x: number;
  y: number;
}

/**
 * Shift that keeps `bubble` (its natural, unshifted rect) inside `viewport`.
 * Only the axis perpendicular to the placement family is clamped: top/bottom
 * bubbles clamp horizontally, left/right bubbles vertically. The other axis
 * is page-scroll territory (vertical overflow scrolls; flipping is a
 * separate concern and stays out of this pure computation).
 */
export function computeViewportShift(
  bubble: PopoverBox,
  viewport: { width: number; height: number },
  family: PopoverFamily,
): PopoverShift {
  const horizontal = family === 'top' || family === 'bottom';
  return {
    x: horizontal ? clampAxis(bubble.left, bubble.width, viewport.width) : 0,
    y: horizontal ? 0 : clampAxis(bubble.top, bubble.height, viewport.height),
  };
}

function clampAxis(start: number, size: number, viewportSize: number): number {
  // A bubble at least as wide as the viewport minus both margins cannot fit
  // between the margins — pin its start edge to the margin instead of
  // oscillating between the two overflow branches.
  if (size >= viewportSize - VIEWPORT_MARGIN * 2) {
    return VIEWPORT_MARGIN - start;
  }
  if (start < VIEWPORT_MARGIN) return VIEWPORT_MARGIN - start;
  if (start + size > viewportSize - VIEWPORT_MARGIN) {
    return viewportSize - VIEWPORT_MARGIN - size - start;
  }
  return 0;
}
