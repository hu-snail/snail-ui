/**
 * sn-wheel-picker unit tests — uni-end inline wheel-style roller preset.
 *
 * Behaviour only (AGENTS.md §46): the wheel preset classes, selection writes,
 * event forwarding, the slide haptic default and the exposed query API. No
 * rpx numbers in assertions — happy-dom discards lengths it cannot parse.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SnWheelPicker from './sn-wheel-picker.vue';
import { PICKER_DRAG_CLOCK_INJECT } from '../sn-picker-view/sn-picker-view-drag';

const FRUITS = ['apple', 'banana', 'cherry'];

/**
 * Pin the viewport to the 750rpx design reference (375px) so the drag engine's
 * px → rpx fallback ratio is exactly 2 — the drag assertions below read in
 * whole rows (44px = one 88rpx row).
 */
beforeAll(() => {
  Object.defineProperty(globalThis, 'innerWidth', { value: 375, configurable: true, writable: true });
});

// Sibling suites share this worker and may pin their own viewport; re-assert
// the design ratio before each test instead of trusting the previous file.
beforeEach(() => {
  Object.defineProperty(globalThis, 'innerWidth', { value: 375, configurable: true, writable: true });
});

function mountPicker(props: Record<string, unknown> = {}, provide?: Record<string, unknown>) {
  return mount(SnWheelPicker, {
    props: { modelValue: ['apple'], columns: [FRUITS], ...props },
    global: provide ? { provide } : undefined,
  });
}

describe('sn-wheel-picker', () => {
  describe('structure', () => {
    it('renders the wheel style by default', () => {
      const w = mountPicker();
      const roller = w.find('.sn-picker-view');
      expect(roller.classes()).toContain('sn-picker-view--wheel');
    });

    it('renders every option of a column', () => {
      const w = mountPicker();
      const items = w.findAll('.sn-picker-view__item');
      expect(items).toHaveLength(3);
      expect(items[0]?.text()).toBe('apple');
    });

    it('marks the selected row active and fades rows two slots out', () => {
      const w = mountPicker({ modelValue: ['b'], columns: [['a', 'b', 'c', 'd', 'e']] });
      const items = w.findAll('.sn-picker-view__item');
      expect(items[1]?.classes()).toContain('sn-picker-view__item--active');
      expect(items[3]?.classes()).toContain('sn-picker-view__item--far');
    });
  });

  describe('selection', () => {
    it('writes v-model on a row tap', async () => {
      const w = mountPicker();
      await w.findAll('.sn-picker-view__item')[2]!.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['cherry']]);
      expect(w.emitted('change')).toHaveLength(1);
    });

    it('forwards pickstart / pickend', async () => {
      const w = mountPicker();
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchend', { touches: [{ clientY: 300 }] });
      expect(w.emitted('pickstart')).toHaveLength(1);
      expect(w.emitted('pickend')).toHaveLength(1);
    });

    it('stays frozen when disabled', async () => {
      const w = mountPicker({ disabled: true });
      expect(w.find('.sn-picker-view').classes()).toContain('sn-picker-view--disabled');
      await w.findAll('.sn-picker-view__item')[1]!.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('vibrateShort', () => {
    /** Host stub collecting `uni.vibrateShort` calls; cleaned up per test. */
    function stubHost(): unknown[] {
      const calls: unknown[] = [];
      (globalThis as { uni?: unknown }).uni = {
        vibrateShort: (opts: unknown) => calls.push(opts),
      };
      return calls;
    }

    afterEach(() => {
      delete (globalThis as { uni?: unknown }).uni;
    });

    it('vibrates per detent while sliding — on by default', async () => {
      // FB-010：阶跃时钟（+4ms < MIN_SAMPLE_MS）排除动量对落点的干扰。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const calls = stubHost();
      const w = mountPicker({}, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 256 }] });
      expect(calls).toHaveLength(1);
      // Push the clock past the 100ms velocity window so the release carries
      // no flick: settling on the already-ticked row adds no second tick.
      clockT += 200;
      await column.trigger('touchend', { changedTouches: [{ clientY: 256 }] });
      expect(calls).toHaveLength(1);
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('stays silent when vibrateShort is false', async () => {
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const calls = stubHost();
      const w = mountPicker({ vibrateShort: false }, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 212 }] });
      expect(calls).toHaveLength(0);
      clockT += 200;
      await column.trigger('touchend', { changedTouches: [{ clientY: 212 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['cherry']]);
    });

    it('does not vibrate on a tap selection', async () => {
      const calls = stubHost();
      const w = mountPicker();
      await w.findAll('.sn-picker-view__item')[1]!.trigger('tap');
      expect(calls).toHaveLength(0);
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('survives a host whose vibrateShort throws', async () => {
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      (globalThis as { uni?: unknown }).uni = {
        vibrateShort: () => {
          throw new Error('unsupported');
        },
      };
      const w = mountPicker({}, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 256 }] });
      clockT += 200;
      await column.trigger('touchend', { changedTouches: [{ clientY: 256 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });
  });

  describe('exposed API', () => {
    it('delegates the query methods to the roller', () => {
      const w = mountPicker({ modelValue: ['banana'] });
      const vm = w.vm as unknown as {
        getSelectedValues(): string[];
        getSelectedLabels(): string[];
        getSelectedIndex(): number[];
        getColumnData(index: number): Array<{ label: string }>;
      };
      expect(vm.getSelectedValues()).toEqual(['banana']);
      expect(vm.getSelectedLabels()).toEqual(['banana']);
      expect(vm.getSelectedIndex()).toEqual([1]);
      expect(vm.getColumnData(0).map((option) => option.label)).toEqual(FRUITS);
    });

    it('resetColumns falls back to the first selectable row', () => {
      const w = mountPicker({ modelValue: ['cherry'] });
      const vm = w.vm as unknown as { resetColumns(): void; getSelectedValues(): string[] };
      vm.resetColumns();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']]);
    });
  });
});
