/**
 * sn-popover-chrome unit tests — the single-silhouette bubble path.
 *
 * Behaviour (AGENTS.md §46): the path is one continuous outline whose arrow
 * protrudes from the placement's card edge, the arrow base never overlaps a
 * corner arc, and the chrome box always contains the whole silhouette.
 *
 * Coordinate conventions (device px): the bubble rect sits at (pad, pad)
 * inside the chrome box — shifted away from the arrow side by
 * `protrusion + pad` — so the apex lands ON the box edge (0 or box size).
 */

import { describe, it, expect } from 'vitest';
import {
  buildBubbleChrome,
  buildChromeSvgDoc,
  type ChromeGeometryInput,
} from './sn-popover-chrome';

const base: ChromeGeometryInput = {
  width: 240,
  height: 96,
  placement: 'bottom',
  arrow: { protrusion: 11, base: 22 },
  arrowInset: 20,
  radius: 8,
  strokeWidth: 1,
};

function input(overrides: Partial<ChromeGeometryInput>): ChromeGeometryInput {
  return { ...base, ...overrides };
}

/** The path carries an `L x y` vertex at exactly this (rounded) point. */
function hasPoint(path: string, x: number, y: number): boolean {
  return path.includes(`L ${x} ${y}`);
}

describe('sn-popover-chrome', () => {
  describe('buildBubbleChrome', () => {
    it('returns null for a degenerate (unmeasured / zero) bubble box', () => {
      expect(buildBubbleChrome(input({ width: 0, height: 96 }))).toBeNull();
      expect(buildBubbleChrome(input({ width: 240, height: 0 }))).toBeNull();
      expect(buildBubbleChrome(input({ width: -5, height: 96 }))).toBeNull();
    });

    it('protrudes the arrow from the bubble bottom edge for the top family', () => {
      const geo = buildBubbleChrome(input({ placement: 'top' }))!;
      // top placement → arrow side is the bubble's BOTTOM edge → the chrome
      // box extends DOWN past the bubble bottom; the bubble top stays at pad.
      expect(geo.box.offsetTop).toBe(-base.strokeWidth / 2);
      expect(geo.box.height).toBe(base.height + base.arrow.protrusion + base.strokeWidth);
      // Apex at (bubble center, box bottom): x = 0.5 + 120, y = 108 - 0.5.
      expect(hasPoint(geo.path, 120.5, 107.5)).toBe(true);
    });

    it('protrudes the arrow from the bubble top edge for the bottom family', () => {
      const geo = buildBubbleChrome(input({ placement: 'bottom' }))!;
      expect(geo.box.offsetTop).toBe(-base.arrow.protrusion - base.strokeWidth / 2);
      expect(geo.box.height).toBe(base.height + base.arrow.protrusion + base.strokeWidth);
      // Apex on the box top edge: (120.5, 0.5).
      expect(hasPoint(geo.path, 120.5, 0.5)).toBe(true);
    });

    it('protrudes the arrow leftward for the right family', () => {
      const geo = buildBubbleChrome(input({ placement: 'right' }))!;
      expect(geo.box.offsetLeft).toBe(-base.arrow.protrusion - base.strokeWidth / 2);
      expect(geo.box.width).toBe(base.width + base.arrow.protrusion + base.strokeWidth);
      // Apex on the box left edge (0.5), at the bubble's vertical center (48.5).
      expect(hasPoint(geo.path, 0.5, 48.5)).toBe(true);
    });

    it('protrudes the arrow rightward for the left family', () => {
      const geo = buildBubbleChrome(input({ placement: 'left' }))!;
      expect(geo.box.offsetLeft).toBe(-base.strokeWidth / 2);
      expect(geo.box.width).toBe(base.width + base.arrow.protrusion + base.strokeWidth);
      // Apex on the box right edge (box.width - pad), vertical center.
      expect(hasPoint(geo.path, 251.5, 48.5)).toBe(true);
    });

    it('defaults the arrow to the side center and honors a custom arrowCenter', () => {
      const centered = buildBubbleChrome(input({ placement: 'bottom' }))!;
      expect(hasPoint(centered.path, 120.5, 0.5)).toBe(true);
      const shifted = buildBubbleChrome(input({ placement: 'bottom', arrowCenter: 180 }))!;
      expect(hasPoint(shifted.path, 180.5, 0.5)).toBe(true);
    });

    it('pins -start / -end arrows at the inset distance from the near corner', () => {
      const start = buildBubbleChrome(input({ placement: 'bottom-start' }))!;
      // x = pad + inset = 20.5.
      expect(hasPoint(start.path, 20.5, 0.5)).toBe(true);
      const end = buildBubbleChrome(input({ placement: 'bottom-end' }))!;
      // x = pad + width - inset = 220.5.
      expect(hasPoint(end.path, 220.5, 0.5)).toBe(true);
    });

    it('clamps the arrowCenter so the base never overlaps a corner arc', () => {
      // Requested center 4 would put the base inside the 8px corner arc.
      const geo = buildBubbleChrome(input({ placement: 'bottom', arrowCenter: 4 }))!;
      // minCenter = radius + baseHalf = 19 → apex x = 19.5.
      expect(hasPoint(geo.path, 19.5, 0.5)).toBe(true);
      const far = buildBubbleChrome(input({ placement: 'bottom', arrowCenter: 4000 }))!;
      // maxCenter = 240 - 8 - 11 = 221 → apex x = 221.5.
      expect(hasPoint(far.path, 221.5, 0.5)).toBe(true);
    });

    it('drops the arrow when the side is too short for base + corner arcs', () => {
      const geo = buildBubbleChrome(input({ placement: 'bottom', width: 20 }))!;
      // A plain rounded rect survives; no apex vertex pokes past the top edge
      // (apex would sit at (10.5, 0.5) if an arrow were drawn).
      expect(hasPoint(geo.path, 10.5, 0.5)).toBe(false);
    });

    it('is deterministic — identical inputs produce the identical path', () => {
      const a = buildBubbleChrome(input({ placement: 'top-start' }));
      const b = buildBubbleChrome(input({ placement: 'top-start' }));
      expect(a).toEqual(b);
    });

    it('emits one closed subpath and keeps every coordinate inside the box', () => {
      for (const placement of [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'bottom-end',
        'left-start',
        'right-end',
      ] as const) {
        const geo = buildBubbleChrome(input({ placement }))!;
        expect(geo.path.endsWith('Z')).toBe(true);
        expect(geo.path.split('M')).toHaveLength(2);
        // The apex coordinate pair per family must sit inside the box.
        const pad = base.strokeWidth / 2;
        // Apex position per family and alignment. Horizontal families run the
        // arrow along X (inset from the near/far corner), left/right families
        // along Y; -start pins from the top corner, -end from the bottom.
        const startAlong = base.arrowInset;
        const endAlong = base.width - base.arrowInset;
        const crossCenter = pad + base.height / 2;
        const apex: [number, number] =
          placement.startsWith('top')
            ? [
                pad + (placement.endsWith('-start') ? startAlong : placement.endsWith('-end') ? endAlong : base.width / 2),
                geo.box.height - pad,
              ]
            : placement.startsWith('bottom')
              ? [
                  pad + (placement.endsWith('-start') ? startAlong : placement.endsWith('-end') ? endAlong : base.width / 2),
                  pad,
                ]
                : placement.startsWith('left')
                  ? [
                      geo.box.width - pad,
                      placement.endsWith('-start')
                        ? pad + startAlong
                        : placement.endsWith('-end')
                          ? pad + base.height - startAlong
                          : crossCenter,
                    ]
                  : [
                      pad,
                      placement.endsWith('-start')
                        ? pad + startAlong
                        : placement.endsWith('-end')
                          ? pad + base.height - startAlong
                          : crossCenter,
                    ];
        expect(apex[0]).toBeLessThanOrEqual(geo.box.width);
        expect(apex[1]).toBeLessThanOrEqual(geo.box.height);
        expect(hasPoint(geo.path, apex[0], apex[1])).toBe(true);
      }
    });
  });

  describe('buildChromeSvgDoc', () => {
    it('embeds an explicit intrinsic size, the path and the fill', () => {
      const geo = buildBubbleChrome(input({ placement: 'bottom' }))!;
      const doc = buildChromeSvgDoc(geo, { fill: '#ffffff', stroke: 'transparent', strokeWidth: 1 });
      expect(doc).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(doc).toContain(`viewBox="0 0 ${geo.box.width} ${geo.box.height}"`);
      expect(doc).toContain(`width="${geo.box.width}"`);
      expect(doc).toContain(`height="${geo.box.height}"`);
      expect(doc).toContain(`d="${geo.path}"`);
      expect(doc).toContain('fill="#ffffff"');
      expect(doc).not.toContain('stroke=');
    });

    it('carries the stroke attributes only when the outline is visible', () => {
      const geo = buildBubbleChrome(input({ placement: 'top' }))!;
      const doc = buildChromeSvgDoc(geo, { fill: '#18181b', stroke: '#27272a', strokeWidth: 1 });
      expect(doc).toContain('stroke="#27272a"');
      expect(doc).toContain('stroke-width="1"');
      expect(doc).toContain('stroke-linejoin="round"');
    });
  });
});
