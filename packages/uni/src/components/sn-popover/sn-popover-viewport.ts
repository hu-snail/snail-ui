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

/**
 * Fixed-layer coordinates for the MP bubble. MP host wrappers clip
 * absolutely-positioned overflow (uni-app x view default), so the bubble
 * leaves the document flow entirely: `position: fixed` at viewport
 * coordinates computed from the trigger rect — fixed elements escape every
 * ancestor clip. The result is clamped inside the viewport via
 * {@link computeViewportShift}.
 *
 * `placement` is the full 12-direction prop value; `gapPx` the trigger-to-
 * bubble gap (28rpx in px, plus any inline offset the caller folds in).
 */
export function computeFixedPlacement(
  trigger: PopoverBox,
  bubble: { width: number; height: number },
  viewport: { width: number; height: number },
  placement: string,
  gapPx: number,
): { left: number; top: number } {
  const [family, alignment] = placement.split('-') as [PopoverFamily, string?];
  const tLeft = trigger.left;
  const tTop = trigger.top;
  const tRight = trigger.left + trigger.width;
  const tBottom = trigger.top + trigger.height;
  const tCenterX = trigger.left + trigger.width / 2;
  const tCenterY = trigger.top + trigger.height / 2;
  const bw = bubble.width;
  const bh = bubble.height;

  let left: number;
  let top: number;
  if (family === 'bottom') {
    top = tBottom + gapPx;
    left = alignment === 'start' ? tLeft : alignment === 'end' ? tRight - bw : tCenterX - bw / 2;
  } else if (family === 'top') {
    top = tTop - gapPx - bh;
    left = alignment === 'start' ? tLeft : alignment === 'end' ? tRight - bw : tCenterX - bw / 2;
  } else if (family === 'left') {
    left = tLeft - gapPx - bw;
    top = alignment === 'start' ? tTop : alignment === 'end' ? tBottom - bh : tCenterY - bh / 2;
  } else {
    left = tRight + gapPx;
    top = alignment === 'start' ? tTop : alignment === 'end' ? tBottom - bh : tCenterY - bh / 2;
  }

  const shift = computeViewportShift({ left, top, width: bw, height: bh }, viewport, family);
  return { left: left + shift.x, top: top + shift.y };
}
