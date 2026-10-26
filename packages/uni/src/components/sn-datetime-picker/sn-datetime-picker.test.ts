/**
 * sn-datetime-picker unit tests — uni-end date / time sheet.
 *
 * Behaviour only (AGENTS.md §46): the draft vs immediate write paths, the
 * confirm / cancel contract, the beforeConfirm veto, toolbar labels and the
 * roller wiring. No rpx numbers in assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnDatetimePicker from './sn-datetime-picker.vue';

/** 2024-06-15 10:30 local. */
const BASE = new Date(2024, 5, 15, 10, 30, 0).getTime();

function mountPicker(props: Record<string, unknown> = {}) {
  return mount(SnDatetimePicker, {
    props: {
      visible: true,
      modelValue: BASE,
      type: 'date',
      minDate: new Date(2020, 0, 1).getTime(),
      maxDate: new Date(2030, 11, 31).getTime(),
      ...props,
    },
  });
}

const firstColumn = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-datetime-picker-view__column')[0];

describe('sn-datetime-picker', () => {
  describe('structure', () => {
    it('renders the toolbar with the default labels', () => {
      const w = mountPicker();
      expect(w.find('.sn-datetime-picker__cancel').text()).toBe('取消');
      expect(w.find('.sn-datetime-picker__confirm').text()).toBe('确认');
    });

    it('renders the title only when given', () => {
      expect(mountPicker({ title: 'Birthday' }).find('.sn-datetime-picker__title').text()).toBe(
        'Birthday',
      );
      expect(mountPicker().find('.sn-datetime-picker__title').exists()).toBe(false);
    });

    it('honours custom button labels', () => {
      const w = mountPicker({ cancelButtonText: 'no', confirmButtonText: 'yes' });
      expect(w.find('.sn-datetime-picker__cancel').text()).toBe('no');
      expect(w.find('.sn-datetime-picker__confirm').text()).toBe('yes');
    });

    it('stays out of the tree while invisible', () => {
      expect(mountPicker({ visible: false }).find('.sn-datetime-picker').exists()).toBe(false);
    });

    it('renders the roller with the requested column count', () => {
      expect(mountPicker().findAll('.sn-datetime-picker-view__column')).toHaveLength(3);
      expect(
        mountPicker({ type: 'datetime' }).findAll('.sn-datetime-picker-view__column'),
      ).toHaveLength(5);
    });
  });

  describe('confirm / cancel', () => {
    it('writes v-model on confirm (deferred mode)', async () => {
      const w = mountPicker();
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2020);
    });

    it('emits confirm with the value', async () => {
      const w = mountPicker();
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')?.[0]).toEqual([{ value: BASE }]);
    });

    it('emits change while rolling without writing v-model', async () => {
      const w = mountPicker();
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[1]?.trigger('tap');
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('closes after confirm', async () => {
      const w = mountPicker();
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('writes v-model immediately in immediateChange mode', async () => {
      const w = mountPicker({ immediateChange: true });
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toBeTypeOf('number');
    });

    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountPicker({ beforeConfirm: () => false });
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('keeps the sheet open when the async beforeConfirm resolves false', async () => {
      const w = mountPicker({ beforeConfirm: async () => false });
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
    });

    it('passes the drafted value into beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true);
      const w = mountPicker({ beforeConfirm });
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      await Promise.resolve();
      const value = beforeConfirm.mock.calls[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2020);
    });

    it('emits cancel and closes without writing the model', async () => {
      const w = mountPicker();
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      await w.find('.sn-datetime-picker__cancel').trigger('tap');
      expect(w.emitted('cancel')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('drops the draft on cancel so reopening starts from the model', async () => {
      const w = mountPicker();
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      await w.find('.sn-datetime-picker__cancel').trigger('tap');
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      expect(w.find('.sn-datetime-picker-view__item--active').text()).toBe('2024');
    });
  });

  describe('open + popup wiring', () => {
    it('emits open when visibility flips on', async () => {
      const w = mountPicker({ visible: false });
      await w.setProps({ visible: true });
      expect(w.emitted('open')).toHaveLength(1);
    });

    it('closes on mask tap when closeOnClickModal is on', async () => {
      const w = mountPicker();
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('stays open on mask tap when closeOnClickModal is off', async () => {
      const w = mountPicker({ closeOnClickModal: false });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')).toBeUndefined();
    });
  });

  describe('time type', () => {
    it('renders two columns and echoes the HH:mm value', () => {
      const w = mountPicker({ type: 'time', modelValue: '10:30' });
      expect(w.findAll('.sn-datetime-picker-view__column')).toHaveLength(2);
      expect(w.findAll('.sn-datetime-picker-view__item--active').map((i) => i.text())).toEqual([
        '10',
        '30',
      ]);
    });

    it('confirms the string value unchanged', async () => {
      const w = mountPicker({ type: 'time', modelValue: '10:30' });
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')?.[0]).toEqual([{ value: '10:30' }]);
    });
  });

  /* ── wd-datetime-picker parity props ─────────────────────────────────── */

  it('accepts root-portal and forwards it to the popup', () => {
    const w = mountPicker({ rootPortal: true });
    const popup = w.findComponent({ name: 'SnPopup' });
    expect(popup.props('rootPortal')).toBe(true);
  });

  it('accepts display-format-tab-label without affecting the single-value sheet', () => {
    const w = mountPicker({ displayFormatTabLabel: (tab: string) => tab.toUpperCase() });
    expect(w.find('.sn-datetime-picker').exists()).toBe(true);
  });

  describe('prop forwarding', () => {
    it('adds the seconds column to the datetime sheet when useSecond is set', () => {
      expect(
        mountPicker({ type: 'datetime', useSecond: true }).findAll(
          '.sn-datetime-picker-view__column',
        ),
      ).toHaveLength(6);
    });

    it('forwards the time bounds to the roller body', () => {
      const w = mountPicker({
        type: 'time',
        modelValue: '10:30',
        minHour: 8,
        maxHour: 18,
        minMinute: 5,
        maxMinute: 55,
        minSecond: 10,
        maxSecond: 50,
        useSecond: true,
      });
      const view = w.findComponent({ name: 'SnDatetimePickerView' });
      expect(view.props('minHour')).toBe(8);
      expect(view.props('maxHour')).toBe(18);
      expect(view.props('minMinute')).toBe(5);
      expect(view.props('maxMinute')).toBe(55);
      expect(view.props('minSecond')).toBe(10);
      expect(view.props('maxSecond')).toBe(50);
      expect(view.props('useSecond')).toBe(true);
    });

    it('forwards minDate / maxDate and the label hooks to the roller body', () => {
      const formatter = (type: string, value: number): string => `${type}:${value}`;
      const filter = (_type: string, values: number[]): number[] => values;
      const minDate = new Date(2021, 0, 1).getTime();
      const maxDate = new Date(2029, 11, 31).getTime();
      const w = mountPicker({ minDate, maxDate, formatter, filter });
      const view = w.findComponent({ name: 'SnDatetimePickerView' });
      expect(view.props('minDate')).toBe(minDate);
      expect(view.props('maxDate')).toBe(maxDate);
      expect(view.props('formatter')).toBe(formatter);
      expect(view.props('filter')).toBe(filter);
    });

    it('forwards the roller geometry and key props', () => {
      const w = mountPicker({
        itemHeight: 33,
        visibleItemCount: 5,
        valueKey: 'v',
        labelKey: 'l',
      });
      const view = w.findComponent({ name: 'SnDatetimePickerView' });
      expect(view.props('itemHeight')).toBe(33);
      expect(view.props('visibleItemCount')).toBe(5);
      expect(view.props('valueKey')).toBe('v');
      expect(view.props('labelKey')).toBe('l');
    });

    it('forwards zIndex / safeAreaInsetBottom / customStyle to the popup', () => {
      const w = mountPicker({
        zIndex: 42,
        safeAreaInsetBottom: false,
        customStyle: 'background: red',
      });
      const popup = w.findComponent({ name: 'SnPopup' });
      expect(popup.props('zIndex')).toBe(42);
      expect(popup.props('safeAreaInsetBottom')).toBe(false);
      expect(popup.props('customStyle')).toBe('background: red');
    });

    it('merges customClass into the popup and customViewClass into the roller', () => {
      const w = mountPicker({ customClass: 'my-sheet', customViewClass: 'my-roller' });
      expect(w.find('.sn-datetime-picker-popup.my-sheet').exists()).toBe(true);
      expect(w.find('.sn-datetime-picker-view.my-roller').exists()).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('exposes the toolbar actions as labelled buttons', () => {
      const w = mountPicker({ title: 'When' });
      const cancel = w.find('.sn-datetime-picker__cancel');
      const confirm = w.find('.sn-datetime-picker__confirm');
      expect(cancel.attributes('role')).toBe('button');
      expect(cancel.attributes('aria-label')).toBe('取消');
      expect(confirm.attributes('role')).toBe('button');
      expect(confirm.attributes('aria-label')).toBe('确认');
    });
  });

  describe('confirm contract edges', () => {
    it('closes without confirming when the model is empty', async () => {
      const w = mountPicker({ modelValue: undefined, type: 'time' });
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('proceeds when the async beforeConfirm resolves true', async () => {
      const w = mountPicker({ beforeConfirm: async () => true });
      await w.find('.sn-datetime-picker__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('emits change alongside the immediate model write', async () => {
      const w = mountPicker({ immediateChange: true });
      await firstColumn(w)?.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toHaveLength(1);
      expect(w.emitted('change')).toHaveLength(1);
      const change = w.emitted('change')?.[0]?.[0] as { value: number };
      expect(new Date(change.value).getFullYear()).toBe(2020);
    });

    it('emits open on every reopen', async () => {
      const w = mountPicker({ visible: false });
      await w.setProps({ visible: true });
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      expect(w.emitted('open')).toHaveLength(2);
    });
  });
});
