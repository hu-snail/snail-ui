/**
 * sn-picker-view unit tests — uni-end roller picker body.
 *
 * Behaviour only (AGENTS.md §46): key resolution, tap selection, disabled
 * rows, the cascade column derivation and the exposed query API. No rpx
 * numbers in assertions — happy-dom discards lengths it cannot parse.
 */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
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

// Sibling suites share this worker and may pin their own viewport; re-assert
// the design ratio before each test instead of trusting the previous file.
beforeEach(() => {
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

  describe('presentation props', () => {
    it('applies customClass to the root', () => {
      expect(mountView({ customClass: 'my-roller' }).classes()).toContain('my-roller');
    });

    it('appends customStyle after the inline CSS variables', () => {
      // The style attribute is read back verbatim — happy-dom only drops
      // lengths when *computing* styles, never on the raw attribute.
      const w = mountView({ customStyle: 'background: red' });
      const style = w.attributes('style');
      expect(style).toContain('--sn-picker-view-item-height:');
      expect(style).toContain('background: red');
    });

    it('scales the roller geometry with itemHeight / visibleItemCount', () => {
      const w = mountView({ itemHeight: 22, visibleItemCount: 3 });
      const style = w.attributes('style') ?? '';
      // 22px design → 44rpx rows; the fade mask is (3 − 1) rows / 2 tall.
      // Only the string-bound root vars are observable — happy-dom drops
      // rpx lengths set through style *object* bindings (see file header).
      expect(style).toContain('--sn-picker-view-item-height: 44rpx');
      expect(style).toContain('--sn-picker-view-mask-height: 44rpx');
    });

    it('renders the group role but no aria-disabled while enabled', () => {
      const w = mountView();
      expect(w.attributes('role')).toBe('group');
      expect(w.attributes('aria-disabled')).toBeUndefined();
    });

    it('hides the decorative masks and indicator from assistive tech', () => {
      const w = mountView();
      const column = w.find('.sn-picker-view__column');
      for (const node of [
        column?.find('.sn-picker-view__mask--top'),
        column?.find('.sn-picker-view__mask--bottom'),
        column?.find('.sn-picker-view__indicator'),
      ]) {
        expect(node?.attributes('aria-hidden')).toBe('true');
      }
    });
  });

  describe('exposed API', () => {
    it('getSelectedOptions returns the raw option objects in column order', () => {
      const option = { id: 2, text: 'Two' };
      const w = mountView({
        modelValue: [1],
        columns: [[{ id: 1, text: 'One' }, option]],
        valueKey: 'id',
        labelKey: 'text',
      });
      const vm = w.vm as unknown as {
        getSelectedOptions(): Array<unknown>;
      };
      expect(vm.getSelectedOptions()).toEqual([{ id: 1, text: 'One' }]);
    });

    it('getSelectedIndex / getColumnIndex report the selected row per column', () => {
      const w = mountView({ modelValue: ['cherry'], columns: [FRUITS, ['a', 'b']] });
      const vm = w.vm as unknown as {
        getSelectedIndex(): number[];
        getColumnIndex(): number[];
      };
      expect(vm.getSelectedIndex()).toEqual([2, 0]);
      expect(vm.getColumnIndex()).toEqual([2, 0]);
    });

    it('getColumnsData returns every normalized column', () => {
      const w = mountView({ columns: [FRUITS, ['a', 'b']] });
      const vm = w.vm as unknown as {
        getColumnsData(): Array<Array<{ value: string | number; label: string }>>;
      };
      const data = vm.getColumnsData();
      expect(data).toHaveLength(2);
      expect(data[1]?.map((option) => option.label)).toEqual(['a', 'b']);
    });

    it('resetColumns skips a disabled first row', () => {
      const w = mountView({
        modelValue: ['c'],
        columns: [
          [
            { value: 'a', label: 'a', disabled: true },
            { value: 'b', label: 'b' },
            { value: 'c', label: 'c' },
          ],
        ],
      });
      const vm = w.vm as unknown as { resetColumns(): void };
      vm.resetColumns();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['b']]);
      expect(w.emitted('change')?.at(-1)?.[0]).toMatchObject({ selectedValues: ['b'] });
    });
  });

  describe('edge cases', () => {
    it('renders nothing for empty columns and stays inert', async () => {
      const w = mountView({ columns: [] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(0);
      await w.find('.sn-picker-view').trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('falls back to the first row for an out-of-range value', async () => {
      const w = mountView({ modelValue: ['durian'] });
      const items = w.findAll('.sn-picker-view__item');
      expect(items[0]?.classes()).toContain('sn-picker-view__item--active');
      expect(items[0]?.attributes('aria-selected')).toBe('true');
      // Row 0 is the fallback itself (already "selected"), but another row
      // still commits from the effective base.
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['banana']]);
    });

    it('emits one change per tap on rapid re-selection', async () => {
      const w = mountView({ modelValue: ['apple'] });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      await w.findAll('.sn-picker-view__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toHaveLength(2);
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual([['cherry']]);
      expect(w.emitted('change')?.at(-1)?.[0]).toMatchObject({
        selectedValues: ['cherry'],
        selectedOptions: ['cherry'],
      });
    });

    it('re-renders when the column count changes', async () => {
      const w = mountView({ modelValue: ['apple', 'a'] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(1);
      await w.setProps({ columns: [FRUITS, ['a', 'b']] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
      expect(w.findAll('.sn-picker-view__column')[1]?.text()).toContain('a');
    });

    it('returns to rest on touchcancel without committing', async () => {
      const w = mountView({ modelValue: ['apple'] });
      const column = w.find('.sn-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 250 }] });
      await column.trigger('touchcancel');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('pickend')).toHaveLength(1);
      expect(w.find('.sn-picker-view__roller').classes()).not.toContain(
        'sn-picker-view__roller--dragging',
      );
    });

    it('echoes raw option objects in the change payload', async () => {
      const option = { id: 2, text: 'Two' };
      const w = mountView({
        modelValue: [1],
        columns: [[{ id: 1, text: 'One' }, option]],
        valueKey: 'id',
        labelKey: 'text',
      });
      await w.findAll('.sn-picker-view__item')[1]?.trigger('tap');
      const payload = w.emitted('change')?.at(-1)?.[0] as PickerViewChangePayload;
      expect(payload.selectedOptions).toEqual([{ id: 2, text: 'Two' }]);
    });

    it('derives the root column only for an out-of-range cascade path', () => {
      const TREE = [
        {
          value: 'zj',
          label: 'Zhejiang',
          children: [
            { value: 'hz', label: 'Hangzhou' },
            { value: 'nb', label: 'Ningbo' },
          ],
        },
      ];
      const w = mountView({ cascade: true, columns: TREE, modelValue: ['zj', 'nowhere'] });
      expect(w.findAll('.sn-picker-view__column')).toHaveLength(2);
      const secondColumn = w.findAll('.sn-picker-view__column')[1];
      expect(secondColumn?.find('.sn-picker-view__item--active').text()).toBe('Hangzhou');
    });
  });
});
