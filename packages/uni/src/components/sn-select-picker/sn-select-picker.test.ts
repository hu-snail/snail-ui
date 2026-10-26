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

    it('forwards loadingColor as a custom property', () => {
      const w = mountSelect({ loadingColor: 'rgb(1, 2, 3)' });
      expect(w.find('.sn-select-picker').attributes('style')).toContain(
        '--sn-select-picker-loading-color: rgb(1, 2, 3)',
      );
    });
  });

  describe('disabled options', () => {
    const WITH_DISABLED = [
      { value: 'a', label: 'Apple', disabled: true },
      { value: 'b', label: 'Banana' },
    ];

    it('renders the disabled affordance', () => {
      const w = mountSelect({ columns: WITH_DISABLED });
      const item = w.findAll('.sn-select-picker__item')[0];
      expect(item?.classes()).toContain('sn-select-picker__item--disabled');
      expect(item?.attributes('aria-disabled')).toBe('true');
      expect(item?.attributes('aria-pressed')).toBe('false');
    });

    it('does not select a disabled option', async () => {
      // Regression: the row carried the disabled class + aria-disabled but
      // onOptionTap never checked the flag, so tapping still committed it.
      const w = mountSelect({ columns: WITH_DISABLED, modelValue: [] });
      await w.findAll('.sn-select-picker__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('change')).toBeUndefined();
    });

    it('still toggles the enabled rows around a disabled one', async () => {
      const w = mountSelect({ columns: WITH_DISABLED, modelValue: [] });
      await w.findAll('.sn-select-picker__item')[1]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([['b']]);
    });
  });

  describe('value shapes', () => {
    it('supports boolean values in radio mode', async () => {
      const w = mountSelect({
        type: 'radio',
        modelValue: false,
        columns: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      });
      const items = w.findAll('.sn-select-picker__item');
      expect(items[1]?.classes()).toContain('sn-select-picker__item--active');
      await items[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual([true]);
    });

    it('emits the raw option objects in the confirm payload', async () => {
      const w = mountSelect({ modelValue: ['a', 'b'] });
      await w.find('.sn-select-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')?.[0]).toEqual([
        {
          value: ['a', 'b'],
          selectedItems: [
            { value: 'a', label: 'Apple' },
            { value: 'b', label: 'Banana' },
          ],
        },
      ]);
    });

    it('proceeds when the async beforeConfirm resolves true', async () => {
      const w = mountSelect({ modelValue: ['a'], beforeConfirm: async () => true });
      await w.find('.sn-select-picker__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('toggles the same option twice on rapid taps', async () => {
      const w = mountSelect({ modelValue: [] });
      const item = w.findAll('.sn-select-picker__item')[1];
      await item?.trigger('tap');
      await item?.trigger('tap');
      expect(w.emitted('update:modelValue')).toEqual([[['b']], [[]]]);
    });
  });

  describe('prop forwarding', () => {
    it('merges customClass into the popup and customContentClass into the body', () => {
      const w = mountSelect({ customClass: 'my-sheet', customContentClass: 'my-body' });
      expect(w.find('.sn-select-picker-popup.my-sheet').exists()).toBe(true);
      expect(w.find('.sn-select-picker__body.my-body').exists()).toBe(true);
    });

    it('forwards zIndex / safeAreaInsetBottom / customStyle to the popup', () => {
      const w = mountSelect({
        zIndex: 42,
        safeAreaInsetBottom: false,
        customStyle: 'background: red',
      });
      const popup = w.findComponent({ name: 'SnPopup' });
      expect(popup.props('zIndex')).toBe(42);
      expect(popup.props('safeAreaInsetBottom')).toBe(false);
      expect(popup.props('customStyle')).toBe('background: red');
    });

    it('accepts select-size as the documented parity prop', () => {
      const w = mountSelect({ selectSize: 'large' });
      expect(w.findAll('.sn-select-picker__item')).toHaveLength(3);
    });
  });

  describe('search field', () => {
    it('labels the search input with the placeholder', () => {
      const w = mountSelect({ filterable: true, filterPlaceholder: 'find it' });
      const input = w.find('.sn-select-picker__filter-input');
      expect(input.attributes('placeholder')).toBe('find it');
      expect(input.attributes('aria-label')).toBe('find it');
    });

    it('defaults the placeholder to 搜索', () => {
      const w = mountSelect({ filterable: true });
      expect(w.find('.sn-select-picker__filter-input').attributes('placeholder')).toBe('搜索');
    });

    it('resets the keyword on reopen', async () => {
      const w = mountSelect({ filterable: true, visible: false });
      await w.setProps({ visible: true });
      await w.find('.sn-select-picker__filter-input').setValue('zzz');
      expect(w.find('.sn-select-picker__empty').exists()).toBe(true);
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      expect(w.findAll('.sn-select-picker__item')).toHaveLength(3);
    });
  });

  describe('scroll into view + empty state', () => {
    it('points the scroll-view at the active row when scrollIntoView is on', () => {
      const w = mountSelect({ modelValue: ['b'], scrollIntoView: true });
      expect(w.find('.sn-select-picker__scroll').attributes('scroll-into-view')).toBe(
        'sn-select-picker-active',
      );
      expect(w.findAll('.sn-select-picker__item')[1]?.attributes('id')).toBe(
        'sn-select-picker-active',
      );
    });

    it('clears the scroll target when scrollIntoView is off', () => {
      // The row marker stays — it identifies the selection; the prop only
      // decides whether the scroll-view is told to jump to it.
      const w = mountSelect({ modelValue: ['b'], scrollIntoView: false });
      expect(w.find('.sn-select-picker__scroll').attributes('scroll-into-view')).toBe('');
      expect(w.findAll('.sn-select-picker__item')[1]?.attributes('id')).toBe(
        'sn-select-picker-active',
      );
    });

    it('shows the empty state for an empty option list', () => {
      const w = mountSelect({ columns: [] });
      expect(w.find('.sn-select-picker__empty').exists()).toBe(true);
    });
  });

  describe('visibility contract', () => {
    it('reseeds the draft from the model on every open', async () => {
      const w = mountSelect({ modelValue: ['a'], visible: false });
      await w.setProps({ visible: true });
      await w.findAll('.sn-select-picker__item')[1]?.trigger('tap');
      await w.setProps({ visible: false });
      // The consumer rejects the draft by writing the model back.
      await w.setProps({ modelValue: ['c'] });
      await w.setProps({ visible: true });
      const items = w.findAll('.sn-select-picker__item');
      expect(items[2]?.classes()).toContain('sn-select-picker__item--active');
      expect(items[0]?.classes()).not.toContain('sn-select-picker__item--active');
    });

    it('emits update:visible false on cancel', async () => {
      const w = mountSelect();
      await w.find('.sn-select-picker__cancel').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('exposes the loading state to assistive tech', () => {
      const loading = mountSelect({ loading: true }).find('.sn-select-picker__loading');
      expect(loading.attributes('role')).toBe('status');
      expect(loading.attributes('aria-live')).toBe('polite');
    });

    it('exposes the footer actions as labelled buttons', () => {
      const w = mountSelect();
      expect(w.find('.sn-select-picker__cancel').attributes('role')).toBe('button');
      expect(w.find('.sn-select-picker__cancel').attributes('aria-label')).toBe('cancel');
      expect(w.find('.sn-select-picker__confirm').attributes('aria-label')).toBe('confirm');
    });
  });
});
