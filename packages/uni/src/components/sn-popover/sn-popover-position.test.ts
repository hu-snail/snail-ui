/**
 * sn-popover position math unit tests (wd-popover `usePopover` parity).
 *
 * Behaviour: the inline styles are derived from the measured trigger + pop
 * sizes exactly like the reference placement table — the bubble sits on its
 * placement side at the arrow gap, the centre family centres on the trigger,
 * -start / -end align to the trigger edges (arrow inset included), and the
 * offset folds in per family. `updatePosition` re-derives only when the
 * measured pop size changed.
 *
 * Two coordinate spaces share one table:
 *   - `control`         → root-relative coords for the `absolute` bubble (H5 / App);
 *   - `controlViewport` → viewport coords for the `fixed` bubble (mini-program,
 *     where the host wrapper clips anything that leaves the component box).
 */

import { describe, it, expect } from 'vitest';
import {
  POP_ARROW_SIZE,
  POP_GAP,
  computeViewportPlacement,
  createPopoverPosition,
  type PopoverOffset,
  type PopoverRect,
} from './sn-popover-position';

/** Trigger: 120 × 44 at an arbitrary origin. */
const trigger: PopoverRect = { left: 100, top: 200, width: 120, height: 44, bottom: 244 };

/** Pop: 200 × 100. */
const pop: PopoverRect = { left: 0, top: 0, width: 200, height: 100, bottom: 100 };

function styles(
  placement: Parameters<ReturnType<typeof createPopoverPosition>['control']>[0],
  offset: PopoverOffset = 0,
  popRect: PopoverRect = pop,
  triggerRect: PopoverRect = trigger,
) {
  const position = createPopoverPosition(true);
  position.init(triggerRect, popRect);
  return position.control(placement, offset);
}

describe('sn-popover-position', () => {
  describe('constants', () => {
    it('keeps the tuned geometry — 9px arrow and the 10px bubble gap (roomier than wd-popover by design)', () => {
      expect(POP_ARROW_SIZE).toBe(9);
      expect(POP_GAP).toBe(10);
    });
  });

  describe('init', () => {
    it('captures the trigger and pop measurements', () => {
      const below = styles('bottom');
      // top = arrow 9 + trigger height 44 + gap 10 = 63 (relative to the root).
      expect(below.popStyle).toContain('top: 63px');
    });
  });

  describe('control — centre family', () => {
    it('centres the bubble on the trigger for every direction', () => {
      const below = styles('bottom');
      // top = arrow 9 + trigger height 44 + gap 10 = 63 (relative to the root).
      expect(below.popStyle).toBe('left: 60px; top: 63px; transform: translateX(-50%);');
      expect(below.arrowStyle).toBe('left: 100px; transform: translateX(-50%);');

      const above = styles('top');
      expect(above.popStyle).toBe('left: 60px; bottom: 63px; transform: translateX(-50%);');
    });

    it('centres vertically for left / right', () => {
      expect(styles('left').popStyle).toBe(
        'right: 139px; top: 22px; transform: translateY(-50%);',
      );
      expect(styles('right').popStyle).toBe(
        'left: 139px; top: 22px; transform: translateY(-50%);',
      );
      expect(styles('right').arrowStyle).toBe('top: 50px; transform: translateY(-50%);');
    });

    it('slides the centre arrow opposite the offset, clamped to the bubble', () => {
      // §103 regression: the centre arrow was pinned at 50%, so any offset (or
      // a viewport clamp) left it pointing away from the trigger.
      // pop 200 wide: centre 100 − offset 6 = 94.
      expect(styles('bottom', 6).arrowStyle).toBe('left: 94px; transform: translateX(-50%);');
      // A huge offset clamps the arrow fully onto the bubble: [9, 191].
      // +500 pushes the pop right → the arrow moves left; -500 mirrors it.
      expect(styles('bottom', 500).arrowStyle).toBe('left: 9px; transform: translateX(-50%);');
      expect(styles('bottom', -500).arrowStyle).toBe('left: 191px; transform: translateX(-50%);');
    });

    it('builds the arrow class from the placement family', () => {
      const position = createPopoverPosition(true);
      expect(position.arrowClass('bottom')).toBe('sn-popover__arrow sn-popover__arrow-up');
      expect(position.arrowClass('bottom-start')).toBe('sn-popover__arrow sn-popover__arrow-up');
      expect(position.arrowClass('left')).toBe('sn-popover__arrow sn-popover__arrow-right');
      expect(position.arrowClass('right')).toBe('sn-popover__arrow sn-popover__arrow-left');
      expect(position.arrowClass('top')).toBe('sn-popover__arrow sn-popover__arrow-down');
    });

    it('omits every arrow class when the arrow is hidden', () => {
      const position = createPopoverPosition(false);
      expect(position.arrowClass('bottom')).toBe('');
    });

    it('drops the arrow gap from the placement when the arrow is hidden', () => {
      const position = createPopoverPosition(false);
      position.init(trigger, pop);
      // top = 0 (no arrow) + trigger height 44 + gap 10 = 54.
      expect(position.control('bottom', 0).popStyle).toBe(
        'left: 60px; top: 54px; transform: translateX(-50%);',
      );
    });
  });

  describe('control — -start / -end alignment', () => {
    it('aligns top/bottom -start to the trigger start edge', () => {
      const start = styles('bottom-start');
      expect(start.popStyle).toBe('left: 0px; top: 63px;');
      // pop (200) >= trigger (120) → arrow at trigger width / 2.
      expect(start.arrowStyle).toBe('left: 60px;');
    });

    it('aligns top/bottom -end to the trigger end edge', () => {
      const end = styles('bottom-end');
      // Only the ARROW carries the translate here — the pop is flush to the edge.
      expect(end.popStyle).toBe('right: 0px; top: 63px;');
      expect(end.arrowStyle).toBe('right: 60px; transform: translateX(50%);');
    });

    it('insets the arrow by (pop width - 25) when the pop is narrower than the trigger', () => {
      const narrow: PopoverRect = { ...pop, width: 80 };
      expect(styles('bottom-start', 0, narrow).arrowStyle).toBe('left: 55px;');
      expect(styles('top-end', 0, narrow).arrowStyle).toBe(
        'right: 55px; transform: translateX(50%);',
      );
    });

    it('aligns left/right -start / -end and insets the vertical arrow', () => {
      const short: PopoverRect = { ...pop, height: 40 };
      expect(styles('left-start', 0, short).arrowStyle).toBe('top: 20px;');
      expect(styles('left-end', 0, short).arrowStyle).toBe(
        'bottom: 20px; transform: translateY(50%);',
      );
      expect(styles('right-start', 0, short).arrowStyle).toBe('top: 20px;');
      // A pop at least as tall as the trigger keeps the arrow at trigger
      // height / 2 — the (pop − 20) inset only applies to a shorter pop.
      const tall: PopoverRect = { ...pop, height: 200 };
      expect(styles('left-start', 0, tall).arrowStyle).toBe('top: 22px;');
    });
  });

  describe('control — offset', () => {
    it('folds a number offset on both axes', () => {
      expect(styles('bottom-start', 10).popStyle).toBe('left: 10px; top: 63px;');
      expect(styles('left-start', 10).popStyle).toBe('right: 139px; top: 10px;');
    });

    it('counter-shifts the arrow by the offset so it keeps pointing at the trigger', () => {
      // The pop slides +10 → the arrow moves -10 (trigger width / 2 − offset).
      expect(styles('bottom-start', 10).arrowStyle).toBe('left: 50px;');
      expect(styles('left-start', 10).arrowStyle).toBe('top: 12px;');
      expect(styles('bottom-start', { x: 6, y: 3 }).arrowStyle).toBe('left: 54px;');
    });

    it('accepts an array offset and defaults y to the first element', () => {
      expect(styles('bottom-start', [4, 8]).popStyle).toBe('left: 4px; top: 63px;');
      expect(styles('bottom-start', [4, 8]).arrowStyle).toBe('left: 56px;');
      expect(styles('left-start', [4, 8]).popStyle).toBe('right: 139px; top: 8px;');
      expect(styles('left-start', [4, 8]).arrowStyle).toBe('top: 14px;');
      // y defaults to x (4) → arrow at trigger height / 2 − 4.
      expect(styles('left-start', [4]).popStyle).toBe('right: 139px; top: 4px;');
      expect(styles('left-start', [4]).arrowStyle).toBe('top: 18px;');
    });

    it('accepts an object offset', () => {
      expect(styles('bottom-start', { x: 6, y: 3 }).popStyle).toBe('left: 6px; top: 63px;');
      expect(styles('left-start', { x: 6, y: 3 }).popStyle).toBe('right: 139px; top: 3px;');
      expect(styles('left-start', { x: 6, y: 3 }).arrowStyle).toBe('top: 19px;');
    });

    it('compensates for a trigger narrower than 34px', () => {
      const tiny: PopoverRect = { ...trigger, width: 20 };
      // trigger width / 2 = 10 → (10 - 17 > 0 ? 0 : 10 - 25) = -15.
      expect(styles('bottom-start', 0, pop, tiny).popStyle).toBe('left: -15px; top: 63px;');
      // horizontalY (22) is still ≥ 17, so the left / right families shift by 0;
      // horizontalX = trigger width 20 + arrow 9 + gap 10.
      expect(styles('left-start', 0, pop, tiny).popStyle).toBe('right: 39px; top: 0px;');
    });
  });

  describe('updatePosition', () => {
    it('re-derives the styles when the measured pop size changed', () => {
      const position = createPopoverPosition(true);
      position.init(trigger, pop);
      position.control('bottom-start', 0);
      expect(position.updatePosition({ ...pop, width: 80 })).toBe(true);
      expect(position.popStyle.value).toBe('left: 0px; top: 63px;');
      expect(position.arrowStyle.value).toBe('left: 55px;');
    });

    it('leaves the styles alone when the measured pop size is unchanged', () => {
      const position = createPopoverPosition(true);
      position.init(trigger, pop);
      position.control('bottom-start', 0);
      const before = position.popStyle.value;
      expect(position.updatePosition({ ...pop, left: 40 })).toBe(false);
      expect(position.popStyle.value).toBe(before);
    });
  });

  describe('controlViewport — the fixed layer on mini-programs', () => {
    // Viewport coords: trigger at (100, 200), 120 × 44; pop 200 × 100.
    const viewport = { width: 375, height: 667 };
    const v = (
      placement: Parameters<ReturnType<typeof createPopoverPosition>['control']>[0],
      offset: PopoverOffset = 0,
    ) => {
      const position = createPopoverPosition(true);
      position.init(trigger, pop);
      return position.controlViewport(placement, offset, viewport);
    };

    it('places the bubble below the trigger in viewport coordinates', () => {
      const below = v('bottom');
      // top = trigger bottom 244 + arrow 9 + gap 10 = 263; left = trigger centre 160 − pop half 100.
      expect(below.popStyle).toBe('left: 60px; top: 263px;');
      expect(below.arrowStyle).toBe('left: 100px; transform: translateX(-50%);');
    });

    it('places the bubble above, left and right of the trigger', () => {
      // top family: trigger top 200 − arrow 9 − gap 10 − pop height 100.
      expect(v('top').popStyle).toBe('left: 60px; top: 81px;');
      // right family would start at 220 + 9 + 10 = 239, but a 200px bubble then
      // ends at 439 > 375 — and the left side has no room either (−119), so it
      // stays on the right and is clamped to the viewport: 375 − 200 = 175.
      expect(v('right').popStyle).toBe('left: 175px; top: 172px;');
    });

    it('places a narrow bubble to the right without clamping', () => {
      // The same trigger, a bubble that fits on the right: 220 + 9 + 10 = 239,
      // ending at 239 + 100 = 339 < 375.
      const position = createPopoverPosition(true);
      position.init(trigger, { ...pop, width: 100 });
      const r = position.controlViewport('right', 0, viewport);
      expect(r.popStyle).toBe('left: 239px; top: 172px;');
      expect(r.placement).toBe('right');
    });

    describe('flip when the preferred side has no room', () => {
      // Trigger hugging the RIGHT edge of a 375px viewport (right edge at 300).
      // Bubble to its right: 300 + arrow 9 + gap 10 = 319 → ends at 439, no room.
      // Bubble to its left: 220 − 9 − 10 − 120 = 81 → ends at 201, fits.
      const nearRight: PopoverRect = { left: 220, top: 200, width: 80, height: 44, bottom: 244 };
      const narrow = { ...pop, width: 120 };
      const solve = (placement: Parameters<ReturnType<typeof createPopoverPosition>['control']>[0]) => {
        const position = createPopoverPosition(true);
        position.init(nearRight, narrow);
        return position.controlViewport(placement, 0, { width: 375, height: 667 });
      };

      it('flips right → left when the right side is off-screen and the left fits', () => {
        const r = solve('right');
        // Right would start at 300 + 19 = 319 and end at 439 → off-screen.
        // Flipped: left of the trigger, 220 − 9 − 10 − 120 = 81.
        expect(r.popStyle).toBe('left: 81px; top: 172px;');
        // The arrow follows the flip: it now points RIGHT at the trigger.
        expect(r.placement).toBe('left');
        expect(r.arrowClass).toBe('sn-popover__arrow sn-popover__arrow-right');
      });

      it('keeps the preferred side when neither side fits, then clamps', () => {
        // A 300px bubble fits neither side of this trigger: right would end at
        // 300 + 14 + 300 = 614, left would start at 220 − 14 − 300 = −94.
        // So it stays on the preferred (right) side and is clamped into the
        // viewport: 375 − 300 = 75.
        const position = createPopoverPosition(true);
        position.init(nearRight, { ...pop, width: 300 });
        const r = position.controlViewport('right', 0, { width: 375, height: 667 });
        expect(r.placement).toBe('right');
        expect(r.popStyle).toContain('left: 75px');
      });

      it('keeps the -start / -end alignment across a flip', () => {
        const position = createPopoverPosition(true);
        position.init(nearRight, narrow);
        const r = position.controlViewport('right-end', 0, { width: 375, height: 667 });
        // Flipped to the left family, still -end: bubble bottom meets trigger bottom.
        expect(r.placement).toBe('left-end');
        expect(r.arrowClass).toBe('sn-popover__arrow sn-popover__arrow-right');
      });
    });

    it('aligns -start / -end to the trigger edges and keeps the arrow on the trigger', () => {
      expect(v('bottom-start').popStyle).toBe('left: 100px; top: 263px;');
      expect(v('bottom-start').arrowStyle).toBe('left: 60px;');
      // -end: the pop's right edge meets the trigger's right edge (220) → 220 − 200.
      expect(v('bottom-end').popStyle).toBe('left: 20px; top: 263px;');
      expect(v('bottom-end').arrowStyle).toBe('right: 60px; transform: translateX(50%);');
    });

    it('folds the offset in and shifts the arrow back onto the trigger', () => {
      expect(v('bottom-start', 10).popStyle).toBe('left: 110px; top: 263px;');
      expect(v('bottom-start', 10).arrowStyle).toBe('left: 50px;');
      // Vertical offset rides the cross axis: centre 222 − 50 + 3 = 175.
      expect(v('left-start', { x: 6, y: 3 }).popStyle).toBe('left: 0px; top: 203px;');
    });

    it('drops the arrow gap when the arrow is hidden', () => {
      const position = createPopoverPosition(false);
      position.init(trigger, pop);
      expect(position.controlViewport('bottom', 0, viewport).popStyle).toBe('left: 60px; top: 254px;');
    });
  });

  describe('computeViewportPlacement', () => {
    const viewport = { width: 375, height: 667 };

    it('clamps the bubble inside the viewport and re-points the arrow at the trigger', () => {
      // Trigger hugging the left edge: the centred bubble would start at −40.
      const nearEdge: PopoverRect = { left: 10, top: 200, width: 120, height: 44, bottom: 244 };
      const r = computeViewportPlacement('bottom', nearEdge, { width: 200, height: 100 }, viewport);
      // Clamped to x = 0; the arrow moves right so it still sits under the trigger centre (70).
      expect(r.left).toBe(0);
      expect(r.top).toBe(263);
      expect(r.arrowCenter).toBe(70);
      expect(r.clamped).toBe(true);
    });

    it('leaves a placement that already fits untouched', () => {
      const r = computeViewportPlacement('bottom', trigger, { width: 200, height: 100 }, viewport);
      expect(r).toEqual({ left: 60, top: 263, arrowCenter: 100, placement: 'bottom', clamped: false });
    });

    it('keeps a bubble taller than the viewport anchored at the top', () => {
      const r = computeViewportPlacement('top', trigger, { width: 200, height: 900 }, viewport);
      expect(r.top).toBe(0);
    });

    it('uses the raw placement when the viewport size is unknown', () => {
      // No viewport yet: no flip and no clamp — a null viewport must not be
      // read as a zero-sized one, which would pin every bubble to the origin.
      const r = computeViewportPlacement('bottom', trigger, { width: 200, height: 100 }, null);
      expect(r).toEqual({ left: 60, top: 263, arrowCenter: 100, placement: 'bottom', clamped: false });
    });
  });
});
