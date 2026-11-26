/**
 * sn-popover placement math — measured positioning (wd-popover parity).
 *
 * The reference library (wot-ui `wd-popover`) positions the bubble from real
 * measurements — trigger rect + bubble size — instead of trusting CSS
 * anchoring, and re-applies the position after the enter transition
 * (`handleAfterEnter → updatePosition`). This module is that math as pure
 * functions so it is unit-testable on every host:
 *
 *   trigger rect + pop size + viewport  →  viewport coords + arrow position
 *
 * The bubble stays `position: absolute` on H5 / classic MP / classic App
 * (converted to root-relative by the caller); uni-app x MP promotes the same
 * coords to `position: fixed` — fixed nodes escape the vapor wrapper's
 * overflow clip (AUI-POP-MP-001 probe-verified), which has no `virtualHost`
 * escape in the uni-x MP compile (unlike the reference library).
 *
 * All inputs/outputs are device px in VIEWPORT coordinates.
 */

import type { ChromeArrowSpec, ChromePlacement } from './sn-popover-chrome';

/** A measured box: viewport coords (left/top) and size. */
export interface AnchorRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PlacementMeasurements {
  /** Trigger box, viewport coords. */
  trigger: AnchorRect;
  /** Natural bubble size (width from the fixed token, auto height). */
  pop: { width: number; height: number };
  viewport: { width: number; height: number };
}

export interface PlacementOptions {
  placement: ChromePlacement;
  /** Cross/gap axis offsets in px (mirrors the `offset` prop semantics). */
  offset: { x: number; y: number };
  /** Static trigger↔bubble gap in px (the stylesheet's 28rpx). */
  gap: number;
  arrow: ChromeArrowSpec;
  radius: number;
}

export interface ComputedPlacement {
  /** Bubble top-left in viewport coords, BEFORE viewport clamping. */
  viewportLeft: number;
  viewportTop: number;
  /**
   * Arrow tip position along the anchored edge, px from the edge start —
   * the trigger-center projection (the chrome clamps it into the edge).
   */
  arrowCenter: number;
}

/** Clamp a point-box into the viewport (min 0 on both axes). */
export function clampToViewport(
  left: number,
  top: number,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): { left: number; top: number; shifted: boolean } {
  const clampedLeft = Math.min(Math.max(left, 0), Math.max(0, viewport.width - size.width));
  const clampedTop = Math.min(Math.max(top, 0), Math.max(0, viewport.height - size.height));
  return {
    left: clampedLeft,
    top: clampedTop,
    shifted: clampedLeft !== left || clampedTop !== top,
  };
}

/**
 * Bubble position + arrow projection for one placement. Mirrors the
 * stylesheet's flow-anchored semantics exactly — `offset.x` rides the cross
 * axis of top/bottom families, `offset.y` the vertical cross axis of
 * left/right families, `offset.{y|x}` extends the gap on the family axis.
 */
export function computeBubblePlacement(
  measurements: PlacementMeasurements,
  options: PlacementOptions,
): ComputedPlacement {
  const { trigger, pop } = measurements;
  const { placement, offset, gap } = options;
  const family = placement.split('-')[0];
  const align = placement.split('-')[1];
  const { width: bw, height: bh } = pop;

  const crossOffset = family === 'top' || family === 'bottom' ? offset.x : offset.y;
  let viewportLeft = 0;
  let viewportTop = 0;

  if (family === 'top') {
    viewportTop = trigger.top - gap - offset.y - bh;
  } else if (family === 'bottom') {
    viewportTop = trigger.top + trigger.height + gap + offset.y;
  } else if (family === 'left') {
    viewportLeft = trigger.left - gap - offset.x - bw;
  } else {
    viewportLeft = trigger.left + trigger.width + gap + offset.x;
  }

  if (family === 'top' || family === 'bottom') {
    if (align === 'start') {
      viewportLeft = trigger.left + crossOffset;
    } else if (align === 'end') {
      viewportLeft = trigger.left + trigger.width - bw + crossOffset;
    } else {
      viewportLeft = trigger.left + trigger.width / 2 - bw / 2 + crossOffset;
    }
  } else {
    if (align === 'start') {
      viewportTop = trigger.top + crossOffset;
    } else if (align === 'end') {
      viewportTop = trigger.top + trigger.height - bh + crossOffset;
    } else {
      viewportTop = trigger.top + trigger.height / 2 - bh / 2 + crossOffset;
    }
  }

  // Arrow points at the trigger center, projected onto the anchored edge.
  const horizontalFamily = family === 'top' || family === 'bottom';
  const arrowCenter = horizontalFamily
    ? trigger.left + trigger.width / 2 - viewportLeft
    : trigger.top + trigger.height / 2 - viewportTop;

  return { viewportLeft, viewportTop, arrowCenter };
}

/**
 * Fixed-layer placement (uni-app x MP): viewport-clamped fixed coords plus
 * the arrow projection recomputed against the clamped position, so the
 * arrow keeps pointing at the trigger after the clamp shifts the bubble.
 */
export function computeFixedPlacement(
  measurements: PlacementMeasurements,
  options: PlacementOptions,
): {
  left: number;
  top: number;
  arrowCenter: number;
  shifted: boolean;
} {
  const raw = computeBubblePlacement(measurements, options);
  const clamped = clampToViewport(raw.viewportLeft, raw.viewportTop, measurements.pop, measurements.viewport);
  const horizontalFamily = options.placement.split('-')[0] === 'top' || options.placement.split('-')[0] === 'bottom';
  const arrowCenter = horizontalFamily
    ? measurements.trigger.left + measurements.trigger.width / 2 - clamped.left
    : measurements.trigger.top + measurements.trigger.height / 2 - clamped.top;
  return { left: clamped.left, top: clamped.top, arrowCenter, shifted: clamped.shifted };
}
