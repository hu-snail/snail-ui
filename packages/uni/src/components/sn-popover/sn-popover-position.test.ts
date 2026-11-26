/**
 * sn-popover position math unit tests.
 *
 * Behaviour: the bubble lands on the placement side at the measured gap,
 * -start/-end align to the trigger edges, the center family centers, and the
 * fixed layer clamps into the viewport while the arrow re-points at the
 * trigger after the clamp.
 */

import { describe, it, expect } from 'vitest';
import {
  clampToViewport,
  computeBubblePlacement,
  computeFixedPlacement,
  type PlacementMeasurements,
  type PlacementOptions,
} from './sn-popover-position';

const measurements: PlacementMeasurements = {
  trigger: { left: 100, top: 200, width: 120, height: 44 },
  pop: { width: 240, height: 96 },
  viewport: { width: 375, height: 667 },
};

const options: PlacementOptions = {
  placement: 'bottom',
  offset: { x: 0, y: 0 },
  gap: 14,
  arrow: { protrusion: 11, base: 22 },
  radius: 8,
};

describe('sn-popover-position', () => {
  describe('computeBubblePlacement', () => {
    it('places the bubble below the trigger at the gap', () => {
      const r = computeBubblePlacement(measurements, options);
      expect(r.viewportTop).toBe(200 + 44 + 14);
    });

    it('places the bubble above the trigger for the top family', () => {
      const r = computeBubblePlacement(measurements, { ...options, placement: 'top' });
      expect(r.viewportTop).toBe(200 - 14 - 96);
    });

    it('places the bubble left / right at the gap', () => {
      const left = computeBubblePlacement(measurements, { ...options, placement: 'left' });
      expect(left.viewportLeft).toBe(100 - 14 - 240);
      const right = computeBubblePlacement(measurements, { ...options, placement: 'right' });
      expect(right.viewportLeft).toBe(100 + 120 + 14);
    });

    it('centers the bubble on the trigger for the center family', () => {
      const r = computeBubblePlacement(measurements, options);
      expect(r.viewportLeft).toBe(100 + 120 / 2 - 240 / 2);
      const v = computeBubblePlacement(measurements, { ...options, placement: 'right' });
      expect(v.viewportTop).toBe(200 + 44 / 2 - 96 / 2);
    });

    it('aligns -start to the trigger start edge and -end to the end edge', () => {
      const start = computeBubblePlacement(measurements, { ...options, placement: 'bottom-start' });
      expect(start.viewportLeft).toBe(100);
      const end = computeBubblePlacement(measurements, { ...options, placement: 'bottom-end' });
      expect(end.viewportLeft).toBe(100 + 120 - 240);
    });

    it('projects the arrow at the trigger center relative to the bubble', () => {
      const r = computeBubblePlacement(measurements, options);
      // trigger center x = 160; bubble left = 40 → arrow at 120.
      expect(r.arrowCenter).toBe(120);
      const v = computeBubblePlacement(measurements, { ...options, placement: 'right' });
      // trigger center y = 222; bubble top = 174 → arrow at 48.
      expect(v.arrowCenter).toBe(48);
    });

    it('folds offset.x into the cross axis of the top/bottom family', () => {
      const r = computeBubblePlacement(measurements, { ...options, offset: { x: 6, y: 2 } });
      expect(r.viewportLeft).toBe(100 + 60 - 120 + 6);
      expect(r.viewportTop).toBe(200 + 44 + 14 + 2);
    });

    it('folds offset.y into the cross axis of the left/right family', () => {
      const r = computeBubblePlacement(measurements, {
        ...options,
        placement: 'left',
        offset: { x: 3, y: 5 },
      });
      expect(r.viewportTop).toBe(200 + 22 - 48 + 5);
      expect(r.viewportLeft).toBe(100 - 14 - 3 - 240);
    });
  });

  describe('clampToViewport', () => {
    it('keeps an in-viewport box untouched and reports shifted=false', () => {
      const r = clampToViewport(40, 300, { width: 240, height: 96 }, measurements.viewport);
      expect(r).toEqual({ left: 40, top: 300, shifted: false });
    });

    it('pulls an overflowing box back inside the viewport', () => {
      const r = clampToViewport(-20, 600, { width: 240, height: 96 }, measurements.viewport);
      expect(r.left).toBe(0);
      expect(r.top).toBe(667 - 96);
      expect(r.shifted).toBe(true);
    });

    it('degrades to 0 on a viewport narrower than the bubble', () => {
      const r = clampToViewport(10, 10, { width: 500, height: 96 }, { width: 375, height: 667 });
      expect(r.left).toBe(0);
    });
  });

  describe('computeFixedPlacement', () => {
    it('passes an unclamped placement through unchanged', () => {
      const r = computeFixedPlacement(measurements, options);
      const raw = computeBubblePlacement(measurements, options);
      expect(r.left).toBe(raw.viewportLeft);
      expect(r.top).toBe(raw.viewportTop);
      expect(r.shifted).toBe(false);
    });

    it('clamps at the viewport edge and re-points the arrow at the trigger', () => {
      // Trigger near the left edge: bottom-center would clamp left to 0.
      const nearEdge: PlacementMeasurements = {
        trigger: { left: 10, top: 200, width: 120, height: 44 },
        pop: { width: 240, height: 96 },
        viewport: measurements.viewport,
      };
      const r = computeFixedPlacement(nearEdge, options);
      expect(r.left).toBe(0);
      expect(r.shifted).toBe(true);
      // Trigger center x = 70, bubble left = 0 → arrow follows to 70.
      expect(r.arrowCenter).toBe(70);
    });
  });
});
