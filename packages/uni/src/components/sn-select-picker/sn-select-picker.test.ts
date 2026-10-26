/**
 * sn-select-picker unit tests — uni-end single / multi select sheet.
 *
 * Behaviour only (AGENTS.md §46): radio vs checkbox write shapes, min / max
 * limits, filtering, the confirm / cancel contract, loading and the
 * beforeConfirm veto. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnSelectPicker from './sn-select-picker.vue';

const COLUMNS = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
];

function mountSelect(props: Record<string, unknown> = {}) {
  return mount(SnSelectPicker, {
    props: { visible: true, columns: COLUMNS, ...props },
  });
}

describe('sn-select-picker', () => {
  describe('structure', () => {
    it('renders the title and every option', () => {
      const w = mountSelect({ title: 'Fruit' });
      expect(w.find('.sn-select-picker__title').text()).toBe('Fruit');
      expect(w.findAll('.sn-select-picker__item')).toHaveLength(3);
    });

    it('renders the default title when none is given', () => {
      expect(mountSelect().find('.sn-select-picker__title').text()).toBe('选择器');
    });

    it('marks the selected rows', () => {
      const w = mountSelect({ modelValue: ['b'] });
      const items = w.findAll('.sn-select-picker__item');
      expect(items[1]?.classes()).toContain('sn-select-picker__item--active');
      expect(items[1]?.attributes('aria-pressed')).toBe('true');
      expect(items[0]?.attributes('aria-pressed')).toBe('false');
    });

    it('renders the selection counter', () => {
      expect(
        mountSelect({ modelValue: ['a', 'b'] })
          .find('.sn-select-picker__count')
          .text(),
      ).toBe('2');
      expect(
        mountSelect({ modelValue: ['a'], max: 3 })
          .find('.sn-select-picker__count')
          .text(),
      ).toBe('1 / 3');
    });

    it('stays out of the tree while invisible', () => {
      expect(mountSelect({ visible: false }).find('.sn-select-picker').exists()).toBe(false);
    });

    it('hides the confirm button when showConfirm is off', () => {
      expect(mountSelect({ showConfirm: false }).find('.sn-select-picker__confirm').exists()).toBe(
        false,
      );
    });
  });

  describe('selection', () => {
    it('adds a value on tap (checkbox mode)', async () => {
      const w = mountSelect({ modelValue: [] });
      await w.findAll('.sn-select-picker__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['b']]);
      expect(w.emitted('change')?.[0]).toEqual([{ value: ['b'] }]);
    });

    it('removes an already selected value', async () => {
      const w = mountSelect({ modelValue: ['b'] });
      await w.findAll('.sn-select-picker__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([[]]);
    });

    it('replaces the value in radio mode', async () => {
      const w = mountSelect({ type: 'radio', modelValue: 'a' });
      await w.findAll('.sn-select-picker__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['c']);
    });

    it('refuses more than `max` selections', async () => {
      const w = mountSelect({ modelValue: ['a', 'b'], max: 2 });
      await w.findAll('.sn-select-picker__item')[2]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('refuses to drop below `min` selections', async () => {
      const w = mountSelect({ modelValue: ['a'], min: 1 });
      await w.findAll('.sn-select-picker__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('ignores taps while loading', async () => {
      const w = mountSelect({ loading: true });
      expect(w.find('.sn-select-picker__loading').exists()).toBe(true);
      expect(w.findAll('.sn-select-picker__item')).toHaveLength(0);
    });
  });

  describe('filtering', () => {
    it('renders the search field when filterable', () => {
      expect(
        mountSelect({ filterable: true }).find('.sn-select-picker__filter-input').exists(),
      ).toBe(true);
      expect(mountSelect().find('.sn-select-picker__filter-input').exists()).toBe(false);
    });

    it('narrows the list while typing', async () => {
      const w = mountSelect({ filterable: true });
      await w.find('.sn-select-picker__filter-input').setValue('ban');
      expect(w.findAll('.sn-select-picker__item')).toHaveLength(1);
      expect(w.find('.sn-select-picker__label').text()).toBe('Banana');
    });

    it('shows the empty state when nothing matches', async () => {
      const w = mountSelect({ filterable: true });
      await w.find('.sn-select-picker__filter-input').setValue('zzz');
      expect(w.find('.sn-select-picker__empty').exists()).toBe(true);
    });
  });

  describe('confirm / cancel', () => {
    it('emits confirm with the value and the selected items', async () => {
      const w = mountSelect({ modelValue: ['a'] });
      await w.find('.sn-select-picker__confirm').trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as {
        value: unknown;
        selectedItems: unknown[];
      };
      expect(payload.value).toEqual(['a']);
      expect(payload.selectedItems).toHaveLength(1);
    });

    it('closes after confirm', async () => {
      const w = mountSelect();
      await w.find('.sn-select-picker__confirm').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountSelect({ beforeConfirm: () => false });
      await w.find('.sn-select-picker__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('reverts the draft on cancel', async () => {
      const w = mountSelect({ modelValue: ['a'] });
      await w.findAll('.sn-select-picker__item')[1]?.trigger('tap');
      await w.find('.sn-select-picker__cancel').trigger('tap');
      expect(w.emitted('cancel')).toHaveLength(1);
      const items = w.findAll('.sn-select-picker__item');
      expect(items[0]?.classes()).toContain('sn-select-picker__item--active');
      expect(items[1]?.classes()).not.toContain('sn-select-picker__item--active');
    });

    it('emits open on show and close on hide', async () => {
      const w = mountSelect({ visible: false });
      await w.setProps({ visible: true });
      expect(w.emitted('open')).toHaveLength(1);
      await w.setProps({ visible: false });
      expect(w.emitted('close')).toHaveLength(1);
    });
  });

  describe('key mapping + colors', () => {
    it('resolves valueKey / labelKey', () => {
      const w = mountSelect({
        modelValue: [2],
        columns: [
          { id: 1, text: 'One' },
          { id: 2, text: 'Two' },
        ],
        valueKey: 'id',
        labelKey: 'text',
      });
      const items = w.findAll('.sn-select-picker__item');
      expect(items[0]?.text()).toContain('One');
      expect(items[1]?.classes()).toContain('sn-select-picker__item--active');
    });

    it('forwards checkedColor as a custom property', () => {
      const w = mountSelect({ checkedColor: 'rgb(7, 8, 9)' });
      expect(w.find('.sn-select-picker').attributes('style')).toContain(
        '--sn-select-picker-checked-color: rgb(7, 8, 9)',
      );
    });
  });
});
