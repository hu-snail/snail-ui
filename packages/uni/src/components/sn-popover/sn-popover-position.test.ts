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
 */

import { describe, it, expect } from 'vitest';
import {
  POP_ARROW_SIZE,
  POP_GAP,
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
});
