/**
 * sn-picker-view unit tests — uni-end roller picker body.
 *
 * Behaviour only (AGENTS.md §46): key resolution, tap selection, disabled
 * rows, the cascade column derivation and the exposed query API. No rpx
 * numbers in assertions — happy-dom discards lengths it cannot parse.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnPickerView from './sn-picker-view.vue';
import { PICKER_DRAG_CLOCK_INJECT } from './sn-picker-view-drag';
import type { PickerViewChangePayload } from './sn-picker-view-types';

const FRUITS = ['apple', 'banana', 'cherry'];

/**
 * Pin the viewport to the 750rpx design reference (375px) so the drag engine's
 * px → rpx fallback ratio is exactly 2 — the drag assertions below then read
 * in whole rows (44px = one 88rpx row) instead of depending on happy-dom's
 * default window width.
 */
beforeAll(() => {
  Object.defineProperty(globalThis, 'innerWidth', {
    value: 375,
    configurable: true,
    writable: true,
  });
});

function mountView(props: Record<string, unknown> = {}, provide?: Record<string, unknown>) {
  return mount(SnPickerView, {
    props: { modelValue: [], columns: [FRUITS], ...props },
    global: provide ? { provide } : undefined,
  });
}

describe('sn-picker-view', () => {
  describe('structure', () => {
    it('renders one column per columns entry', () => {
      const w = mountView({ columns: [FRUITS, ['a', 'b']] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
    });

    it('renders every option of a primitive column', () => {
      const w = mountView();
      const items = w.findAll('.sn-picker-view__item');
      expect(items).toHaveLength(3);
      expect(items[0]?.text()).toBe('apple');
    });

    it('applies the disabled class and aria-disabled', () => {
      const w = mountView({ disabled: true });
      expect(w.classes()).toContain('sn-picker-view--disabled');
      expect(w.attributes('aria-disabled')).toBe('true');
    });

    it('marks the selected row with the active class and aria-selected', () => {
      const w = mountView({ modelValue: ['banana'] });
      const items = w.findAll('.sn-picker-view__item');
      expect(items[1]?.classes()).toContain('sn-picker-view__item--active');
      expect(items[1]?.attributes('aria-selected')).toBe('true');
      expect(items[0]?.attributes('aria-selected')).toBe('false');
    });
  });

  describe('option key resolution', () => {
    it('resolves valueKey / labelKey from option objects', () => {
      const w = mountView({
        modelValue: [2],
        columns: [
          [
            { id: 1, text: 'One' },
            { id: 2, text: 'Two' },
          ],
        ],
        valueKey: 'id',
        labelKey: 'text',
      });
      const items = w.findAll('.sn-picker-view__item');
      expect(items[0]?.text()).toBe('One');
      expect(items[1]?.classes()).toContain('sn-picker-view__item--active');
    });

    it('honours a custom disabled key', () => {
      const w = mountView({
        columns: [
          [
            { value: 1, label: 'A', disabled: true },
            { value: 2, label: 'B' },
          ],
        ],
      });
      const items = w.findAll('.sn-picker-view__item');
      expect(items[0]?.classes()).toContain('sn-picker-view__item--disabled');
      expect(items[0]?.attributes('aria-disabled')).toBe('true');
    });
  });

  describe('selection', () => {
    it('emits update:modelValue when a row is tapped', async () => {
      const w = mountView({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['cherry']]);
    });

    it('emits change with the full payload', async () => {
      const w = mountView({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      const payload = w.emitted('change')?.at(-1)?.[0] as PickerViewChangePayload;
      expect(payload.selectedValues).toEqual(['banana']);
      expect(payload.selectedLabels).toEqual(['banana']);
      expect(payload.selectedIndexes).toEqual([1]);
      expect(payload.columnIndex).toBe(0);
    });

    it('does not emit when the tapped row is already selected', async () => {
      const w = mountView({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit when a disabled row is tapped', async () => {
      const w = mountView({
        modelValue: [1],
        columns: [
          [
            { value: 1, label: 'A' },
            { value: 2, label: 'B', disabled: true },
          ],
        ],
      });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('does not emit when the whole roller is disabled', async () => {
      const w = mountView({ modelValue: ['apple'], disabled: true });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('keeps earlier columns when a later column changes', async () => {
      const w = mountView({ modelValue: ['apple', 'a'], columns: [FRUITS, ['a', 'b']] });
      const secondColumn = w.findAll('.sn-picker-view__column')[1];
      await secondColumn?.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple', 'b']]);
    });
  });

  describe('touch interaction', () => {
    it('emits pickstart on touchstart and pickend on touchend', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 100 }] });
      await column.trigger('touchend', { touches: [{ clientY: 100 }] });
      expect(w.emitted('pickstart')).toHaveLength(1);
      expect(w.emitted('pickend')).toHaveLength(1);
    });

    it('does not emit pickstart when disabled', async () => {
      const w = mountView({ modelValue: ['apple'], disabled: true });
      await w.find('.sn-picker-view__column').trigger('touchstart', { touches: [{ clientY: 0 }] });
      expect(w.emitted('pickstart')).toBeUndefined();
    });

    it('advances the selection when dragged far enough', async () => {
      // FB-010：阶跃时钟（每次 now() +8ms，< MIN_SAMPLE_MS=16）让采样间隔
      // 确定性落进"无动量"窗口——落点只由拖拽位移决定，不受测试负载影响。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const w = mountView(
        { modelValue: ['apple'], itemHeight: 44, visibleItemCount: 6 },
        { [PICKER_DRAG_CLOCK_INJECT]: stepClock },
      );
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      // 50px ≈ 100rpx ≈ one and a bit rows at 88rpx per row.
      await column.trigger('touchend', { touches: [{ clientY: 250 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('does not emit change during the drag unless immediateChange is set', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 200 }] });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('emits change during the drag when immediateChange is set', async () => {
      const w = mountView({ modelValue: ['apple'], immediateChange: true });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 250 }] });
      expect(w.emitted('update:modelValue')).toHaveLength(1);
    });

    it('reads the release point from changedTouches when touches is empty', async () => {
      // Regression: real `touchend` events carry an EMPTY `touches` array and
      // only `changedTouches` holds the point. The old `touches ?? changed…`
      // read returned 0 and snapped the wheel to a wild row on every release.
      // FB-010：注入阶跃时钟（见上）排除动量对落点的干扰。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const w = mountView({ modelValue: ['apple'] }, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300, identifier: 1 }] });
      await column.trigger('touchend', {
        touches: [],
        changedTouches: [{ clientY: 250, identifier: 1 }],
      });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('keeps the drag anchored to the touch origin while committing mid-drag', async () => {
      // Regression: with immediateChange the old code re-based the offset on
      // the live selection on every commit, so rolling back half a row jumped
      // the wheel to the previously committed row instead of the finger.
      const w = mountView({ modelValue: ['apple'], immediateChange: true });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 256 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
      // Emulate the v-model echo so the next commit sees the new selection —
      // the anchor must stay on apple anyway (that is the regression).
      await w.setProps({ modelValue: ['banana'] });
      // Roll the finger back down: the selection must return to apple.
      await column.trigger('touchmove', { touches: [{ clientY: 290 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']]);
    });

    it('skips a disabled row when the drag settles on it', async () => {
      const w = mountView({
        modelValue: ['a'],
        columns: [['a', { value: 'b', label: 'b', disabled: true }, 'c']],
      });
      const column = w.find('.sn-picker-view__column');
      // Exactly one row up — lands on the disabled row, settles past it.
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchend', { touches: [{ clientY: 256 }] });
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['c']]);
    });

    it('stays on the first row when dragged past the top', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchend', { touches: [{ clientY: 900 }] });
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('ignores a second simultaneous finger', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 100 }, { clientY: 200 }] });
      expect(w.emitted('pickstart')).toBeUndefined();
    });

    it('suppresses the row tap that follows a drag', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 256 }] });
      await column.trigger('touchend', { touches: [{ clientY: 256 }] });
      // The tap target is the row the finger went DOWN on (apple), which must
      // not override the row the drag just settled (banana).
      await w.findAll('.sn-picker-view__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('flags the roller as dragging while a finger is down', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      expect(w.find('.sn-picker-view__roller').classes()).toContain(
        'sn-picker-view__roller--dragging',
      );
      await column.trigger('touchend', { touches: [{ clientY: 300 }] });
      expect(w.find('.sn-picker-view__roller').classes()).not.toContain(
        'sn-picker-view__roller--dragging',
      );
    });
  });

  describe('cascade mode', () => {
    const TREE = [
      {
        value: 'zj',
        label: 'Zhejiang',
        children: [
          { value: 'hz', label: 'Hangzhou' },
          { value: 'nb', label: 'Ningbo' },
        ],
      },
      { value: 'js', label: 'Jiangsu', children: [{ value: 'nj', label: 'Nanjing' }] },
    ];

    it('derives a second column from the selected parent', () => {
      const w = mountView({ cascade: true, columns: TREE, modelValue: ['zj'] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
    });

    it('stops deriving columns at a leaf', () => {
      const w = mountView({ cascade: true, columns: TREE, modelValue: ['zj', 'hz'] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
    });

    it('drops deeper selections when a parent changes', async () => {
      const w = mountView({ cascade: true, columns: TREE, modelValue: ['zj', 'hz'] });
      const first = w.findAll('.sn-picker-view__column')[0];
      await first?.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['js']]);
    });

    it('marks the root column as cascade', () => {
      const w = mountView({ cascade: true, columns: TREE });
      expect(w.classes()).toContain('sn-picker-view--cascade');
    });
  });

  describe('exposed API', () => {
    it('getSelectedValues / getSelectedLabels report the effective selection', () => {
      const w = mountView({ modelValue: ['banana'] });
      const vm = w.vm as unknown as {
        getSelectedValues(): Array<string | number>;
        getSelectedLabels(): string[];
      };
      expect(vm.getSelectedValues()).toEqual(['banana']);
      expect(vm.getSelectedLabels()).toEqual(['banana']);
    });

    it('getColumnData returns the normalized column', () => {
      const w = mountView();
      const vm = w.vm as unknown as {
        getColumnData(index: number): Array<{ value: string | number; label: string }>;
      };
      expect(vm.getColumnData(0).map((o) => o.label)).toEqual(FRUITS);
    });

    it('resetColumns moves every column to its first selectable row', () => {
      const w = mountView({ modelValue: ['cherry'] });
      const vm = w.vm as unknown as { resetColumns(): void };
      vm.resetColumns();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['apple']]);
    });
  });

  describe('desktop H5 mouse + wheel', () => {
    it('marks the root and columns for the mouse gesture path', () => {
      const w = mountView();
      expect(w.attributes('data-snui-mouse-gesture')).toBe('picker-view');
      expect(w.find('.sn-picker-view__column').attributes('data-snui-column')).toBe('0');
    });

    it('selects a row from a mouse drag', async () => {
      // FB-010：注入阶跃时钟，让 mouse 采样的速度窗口确定性归零（无动量）。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const w = mountView({ modelValue: ['apple'] }, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-picker-view__column').element;
      // One synchronous batch: the release lands well inside the velocity
      // window, so the drag commits exactly the travelled rows.
      column.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: 300 }),
      );
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: 256 }));
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: 256 }));
      await nextTick();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('does not commit a mouse click in place', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column').element;
      column.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: 300 }),
      );
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: 298 }));
      await nextTick();
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('selects the next row on a wheel notch', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column').element;
      column.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      );
      await nextTick();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
      expect(w.emitted('change')?.at(-1)?.[0]).toMatchObject({
        selectedValues: ['banana'],
        columnIndex: 0,
      });
    });

    it('stops the mouse listeners on unmount', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column').element;
      w.unmount();
      column.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      );
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });
});
