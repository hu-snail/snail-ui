import { describe, expect, it } from 'vitest';
import { computeFixedPlacement, computeViewportShift, VIEWPORT_MARGIN } from './sn-popover-viewport';

const VIEWPORT = { width: 375, height: 812 };

describe('computeViewportShift', () => {
  it('should not shift a bubble that fits inside the viewport', () => {
    const bubble = { left: 60, top: 300, width: 240, height: 130 };
    expect(computeViewportShift(bubble, VIEWPORT, 'bottom')).toEqual({ x: 0, y: 0 });
    expect(computeViewportShift(bubble, VIEWPORT, 'left')).toEqual({ x: 0, y: 0 });
  });

  it('should pull a bottom-centered bubble back inside the right edge', () => {
    // A right-column trigger's centered bubble hangs past the right edge —
    // the real-device screenshot (Bottom cell).
    const bubble = { left: 313, top: 300, width: 240, height: 130 };
    const shift = computeViewportShift(bubble, VIEWPORT, 'bottom');
    expect(shift.x).toBeLessThan(0);
    expect(bubble.left + shift.x + bubble.width).toBeCloseTo(VIEWPORT.width - VIEWPORT_MARGIN);
    expect(shift.y).toBe(0);
  });

  it('should push a bubble past the left edge back inside', () => {
    const bubble = { left: 4, top: 300, width: 240, height: 130 };
    const shift = computeViewportShift(bubble, VIEWPORT, 'top');
    expect(shift.x).toBe(VIEWPORT_MARGIN - bubble.left);
  });

  it('should clamp vertically for left/right families', () => {
    const bubble = { left: 20, top: 700, width: 240, height: 200 };
    const shift = computeViewportShift(bubble, VIEWPORT, 'right');
    expect(shift.x).toBe(0);
    expect(bubble.top + shift.y + bubble.height).toBeCloseTo(VIEWPORT.height - VIEWPORT_MARGIN);
  });

  it('should pin an oversized bubble to the leading margin instead of oscillating', () => {
    const bubble = { left: -50, top: 300, width: 400, height: 130 };
    const shift = computeViewportShift(bubble, VIEWPORT, 'bottom');
    expect(shift.x).toBe(VIEWPORT_MARGIN - bubble.left);
    expect(bubble.left + shift.x).toBe(VIEWPORT_MARGIN);
  });

  it('should return zero shift exactly on the margin boundary', () => {
    const left = VIEWPORT_MARGIN;
    const bubble = { left, top: 300, width: 240, height: 130 };
    expect(computeViewportShift(bubble, VIEWPORT, 'bottom').x).toBe(0);
  });
});

describe('computeFixedPlacement', () => {
  const TRIGGER = { left: 160, top: 200, width: 100, height: 36 };
  const BUBBLE = { width: 240, height: 130 };

  it('should place a bottom-centered bubble under the trigger with the gap', () => {
    const r = computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'bottom', 14);
    expect(r.left).toBeCloseTo(160 + 50 - 120);
    expect(r.top).toBeCloseTo(236 + 14);
  });

  it('should place a top bubble above the trigger', () => {
    const r = computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'top', 14);
    expect(r.top).toBeCloseTo(200 - 14 - 130);
  });

  it('should clamp a right-column trigger so the bubble stays on screen', () => {
    const edgeTrigger = { left: 300, top: 200, width: 60, height: 36 };
    const r = computeFixedPlacement(edgeTrigger, BUBBLE, VIEWPORT, 'bottom', 14);
    expect(r.left).toBe(VIEWPORT.width - VIEWPORT_MARGIN - BUBBLE.width);
    expect(r.left).toBeGreaterThanOrEqual(VIEWPORT_MARGIN);
  });

  it('should align start/end placements to the trigger edges (then clamp)', () => {
    // bottom-start at left 160 overflows the right edge → clamped to 363-240.
    expect(computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'bottom-start', 14).left).toBe(
      VIEWPORT.width - VIEWPORT_MARGIN - BUBBLE.width,
    );
    // bottom-end ends at the trigger's right edge, inside the viewport.
    expect(computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'bottom-end', 14).left).toBe(260 - 240);
    expect(computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'right-start', 14).top).toBe(200);
  });

  it('should anchor left/right families horizontally off the trigger edges', () => {
    expect(computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'left', 14).left).toBeCloseTo(160 - 14 - 240);
    expect(computeFixedPlacement(TRIGGER, BUBBLE, VIEWPORT, 'right', 14).left).toBeCloseTo(260 + 14);
  });
});
