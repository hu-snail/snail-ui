/**
 * sn-calendar unit tests — uni-end calendar sheet.
 *
 * Behaviour only (AGENTS.md §46): the draft vs immediate write paths, the
 * confirm / cancel contract, the beforeConfirm veto, the shortcut chips and
 * the panel wiring. No rpx numbers in assertions.
 */

import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCalendar from './sn-calendar.vue';

const JUNE_15 = new Date(2024, 5, 15).getTime();

function mountCalendar(props: Record<string, unknown> = {}) {
  return mount(SnCalendar, {
    props: {
      visible: true,
      minDate: new Date(2024, 5, 1).getTime(),
      maxDate: new Date(2024, 5, 30).getTime(),
      ...props,
    },
  });
}

const dayCells = (w: ReturnType<typeof mount>) =>
  w
    .findAll('.sn-calendar-view__day')
    .filter((cell) => !cell.classes().includes('sn-calendar-view__day--filler'));

describe('sn-calendar', () => {
  describe('structure', () => {
    it('renders the title and the confirm button', () => {
      const w = mountCalendar();
      expect(w.find('.sn-calendar__title').text()).toBe('选择日期');
      expect(w.find('.sn-calendar__confirm').text()).toBe('确定');
    });

    it('honours a custom title and confirm label', () => {
      const w = mountCalendar({ title: 'Pick a day', confirmText: 'OK' });
      expect(w.find('.sn-calendar__title').text()).toBe('Pick a day');
      expect(w.find('.sn-calendar__confirm').text()).toBe('OK');
    });

    it('hides the confirm button when showConfirm is off', () => {
      expect(mountCalendar({ showConfirm: false }).find('.sn-calendar__confirm').exists()).toBe(
        false,
      );
    });

    it('renders the calendar panel body', () => {
      expect(mountCalendar().find('.sn-calendar-view').exists()).toBe(true);
    });

    it('stays out of the tree while invisible', () => {
      expect(mountCalendar({ visible: false }).find('.sn-calendar').exists()).toBe(false);
    });

    it('renders both footer slots', () => {
      const w = mountCalendar();
      expect(w.find('.sn-calendar__footer-left').exists()).toBe(true);
      expect(w.find('.sn-calendar__footer-right').exists()).toBe(true);
    });
  });

  describe('confirm / cancel', () => {
    it('writes v-model on confirm (deferred mode)', async () => {
      const w = mountCalendar();
      await dayCells(w)[9]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
      await w.find('.sn-calendar__confirm').trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getDate()).toBe(10);
    });

    it('emits confirm with the drafted value', async () => {
      const w = mountCalendar();
      await dayCells(w)[9]?.trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      const payload = w.emitted('confirm')?.[0]?.[0] as { value: number };
      expect(new Date(payload.value).getDate()).toBe(10);
    });

    it('closes after confirm', async () => {
      const w = mountCalendar();
      await w.find('.sn-calendar__confirm').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('emits change on every tap without writing the model', async () => {
      const w = mountCalendar();
      await dayCells(w)[9]?.trigger('tap');
      expect(w.emitted('change')).toHaveLength(1);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('writes the model immediately in immediateChange mode', async () => {
      const w = mountCalendar({ immediateChange: true });
      await dayCells(w)[9]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toHaveLength(1);
    });

    it('keeps the sheet open when beforeConfirm returns false', async () => {
      const w = mountCalendar({ beforeConfirm: () => false });
      await w.find('.sn-calendar__confirm').trigger('tap');
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('passes the draft into beforeConfirm', async () => {
      const beforeConfirm = vi.fn(() => true);
      const w = mountCalendar({ beforeConfirm });
      await dayCells(w)[9]?.trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      await Promise.resolve();
      expect(beforeConfirm).toHaveBeenCalledTimes(1);
      const value = beforeConfirm.mock.calls[0]?.[0] as number;
      expect(new Date(value).getDate()).toBe(10);
    });

    it('reverts the draft on cancel', async () => {
      const w = mountCalendar({ modelValue: JUNE_15 });
      await dayCells(w)[4]?.trigger('tap');
      await w.find('.sn-calendar__cancel').trigger('tap');
      expect(w.emitted('cancel')).toHaveLength(1);
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('15');
    });

    it('emits open when visibility flips on', async () => {
      const w = mountCalendar({ visible: false });
      await w.setProps({ visible: true });
      expect(w.emitted('open')).toHaveLength(1);
    });
  });

  describe('shortcuts', () => {
    it('renders one chip per shortcut', () => {
      const w = mountCalendar({
        shortcuts: [
          { text: 'Today', days: 0 },
          { text: 'Week', days: -7 },
        ],
      });
      expect(w.findAll('.sn-calendar__shortcut')).toHaveLength(2);
    });

    it('writes the preset value on chip tap', async () => {
      const w = mountCalendar({
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toBe(JUNE_15);
    });

    it('computes a relative day offset', async () => {
      const w = mountCalendar({ shortcuts: [{ text: 'Yesterday', days: -1 }] });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      const expected = new Date();
      expected.setHours(0, 0, 0, 0);
      expected.setDate(expected.getDate() - 1);
      expect(value).toBe(expected.getTime());
    });

    it('wraps the shortcut value in an array for range types', async () => {
      const w = mountCalendar({
        type: 'daterange',
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toEqual([JUNE_15, JUNE_15]);
    });

    it('invokes onShortcutsClick with the tapped chip', async () => {
      const onShortcutsClick = vi.fn();
      const shortcut = { text: 'Fixed', value: JUNE_15 };
      const w = mountCalendar({ shortcuts: [shortcut], onShortcutsClick });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      expect(onShortcutsClick).toHaveBeenCalledWith(shortcut);
    });
  });

  describe('panel wiring', () => {
    it('forwards the type to the panel', () => {
      expect(mountCalendar({ type: 'daterange' }).find('.sn-calendar-view').classes()).toContain(
        'sn-calendar-view--daterange',
      );
    });

    it('forwards showPanelTitle', () => {
      expect(
        mountCalendar({ showPanelTitle: false }).find('.sn-calendar-view__month-title').exists(),
      ).toBe(false);
    });

    it('closes on mask tap when closeOnClickModal is on', async () => {
      const w = mountCalendar();
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('stays open on mask tap when closeOnClickModal is off', async () => {
      const w = mountCalendar({ closeOnClickModal: false });
      await w.find('.sn-popup__modal').trigger('tap');
      expect(w.emitted('update:visible')).toBeUndefined();
    });

    it('forwards switchMode controls into the sheet', () => {
      expect(
        mountCalendar({ switchMode: 'month' }).find('.sn-calendar-view__controls').exists(),
      ).toBe(true);
    });

    it('forwards rangePrompt through to the panel hint', () => {
      const w = mountCalendar({
        type: 'daterange',
        maxRange: 7,
        rangePrompt: 'keep it short',
      });
      expect(w.find('.sn-calendar-view__hint').text()).toBe('keep it short');
    });

    it('forwards firstDayOfWeek to the panel headers', () => {
      const w = mountCalendar({ firstDayOfWeek: 1 });
      expect(w.findAll('.sn-calendar-view__week').map((t) => t.text())[0]).toBe('一');
    });

    it('forwards showLunar to the panel grid', () => {
      const w = mountCalendar({ showLunar: true });
      // 2024-06-15 = 甲辰年五月初十（当月第 15 格）。
      expect(dayCells(w)[14]?.find('.sn-calendar-view__day-info--bottom').text()).toBe('初十');
    });
  });

  describe('slots', () => {
    it('renders content in the confirm-left slot', () => {
      const w = mount(SnCalendar, {
        props: { visible: true, minDate: new Date(2024, 5, 1).getTime() },
        slots: { 'confirm-left': '<text class="left-slot">reset</text>' },
      });
      expect(w.find('.left-slot').text()).toBe('reset');
      expect(w.find('.sn-calendar__footer-left').text()).toBe('reset');
    });

    it('renders content in the confirm-right slot', () => {
      const w = mount(SnCalendar, {
        props: { visible: true, minDate: new Date(2024, 5, 1).getTime() },
        slots: { 'confirm-right': '<text class="right-slot">filter</text>' },
      });
      expect(w.find('.right-slot').text()).toBe('filter');
      expect(w.find('.sn-calendar__footer-right').text()).toBe('filter');
    });

    it('replaces the default title with the header slot content (additive)', () => {
      const w = mount(SnCalendar, {
        props: { visible: true, title: '选择日期', minDate: new Date(2024, 5, 1).getTime() },
        slots: { header: '<view class="header-slot">2 dates</view>' },
      });
      expect(w.find('.sn-calendar__header .header-slot').text()).toBe('2 dates');
      // The default title row is gone while the slot owns the header.
      expect(w.find('.sn-calendar__title').exists()).toBe(false);
    });

    it('keeps the default title row when the header slot is unused', () => {
      const w = mountCalendar({ title: 'Pick a day' });
      expect(w.find('.sn-calendar__title').text()).toBe('Pick a day');
      expect(w.find('.sn-calendar__header').exists()).toBe(true);
    });

    it('keeps the rest of the sheet chrome while the header slot is used', () => {
      const w = mount(SnCalendar, {
        props: {
          visible: true,
          minDate: new Date(2024, 5, 1).getTime(),
          shortcuts: [{ text: 'Today', days: 0 }],
        },
        slots: { header: '<view class="header-slot">2 dates</view>' },
      });
      // The additive slot only replaces the title row — grid, chips and footer stay.
      expect(w.find('.sn-calendar__header .header-slot').exists()).toBe(true);
      expect(w.find('.sn-calendar__shortcut').exists()).toBe(true);
      expect(w.find('.sn-calendar-view__day').exists()).toBe(true);
      expect(w.find('.sn-calendar__confirm').exists()).toBe(true);
      expect(w.find('.sn-calendar__footer-left').exists()).toBe(true);
    });
  });

  describe('forwarded classes', () => {
    it('lands customClass on the popup root', () => {
      const w = mountCalendar({ customClass: 'my-sheet' });
      expect(w.find('.my-sheet').exists()).toBe(true);
      expect(w.find('.my-sheet').classes()).toContain('sn-calendar-popup');
    });

    it('lands customStyle on the popup panel', () => {
      const w = mountCalendar({ customStyle: 'margin: 4px;' });
      expect(w.find('.sn-popup__panel').attributes('style')).toContain('margin: 4px');
    });

    it('lands customViewClass on the panel root', () => {
      const w = mountCalendar({ customViewClass: 'my-view' });
      expect(w.find('.sn-calendar-view').classes()).toContain('my-view');
    });
  });

  describe('accessibility', () => {
    it('marks the cancel and confirm actions as buttons with labels', () => {
      const w = mountCalendar({ confirmText: 'OK' });
      expect(w.find('.sn-calendar__cancel').attributes('role')).toBe('button');
      expect(w.find('.sn-calendar__cancel').attributes('aria-label')).toBe('cancel');
      expect(w.find('.sn-calendar__confirm').attributes('role')).toBe('button');
      expect(w.find('.sn-calendar__confirm').attributes('aria-label')).toBe('OK');
    });

    it('marks shortcut chips as labelled buttons', () => {
      const w = mountCalendar({ shortcuts: [{ text: 'Today', days: 0 }] });
      const chip = w.find('.sn-calendar__shortcut');
      expect(chip.attributes('role')).toBe('button');
      expect(chip.attributes('aria-label')).toBe('Today');
    });
  });

  describe('draft sync', () => {
    it('follows an external modelValue change while open (deferred mode)', async () => {
      const w = mountCalendar({ modelValue: JUNE_15 });
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('15');
      await w.setProps({ modelValue: new Date(2024, 5, 20).getTime() });
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('20');
    });

    it('resets the draft back to the model when the sheet reopens', async () => {
      const w = mountCalendar({ modelValue: JUNE_15 });
      await dayCells(w)[4]?.trigger('tap');
      await w.setProps({ visible: false });
      await w.setProps({ visible: true });
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('15');
    });

    it('reflects the committed model directly in immediateChange mode', async () => {
      const w = mountCalendar({ immediateChange: true, modelValue: JUNE_15 });
      await dayCells(w)[19]?.trigger('tap');
      await w.setProps({ modelValue: new Date(2024, 5, 20).getTime() });
      expect(w.find('.sn-calendar-view__day--selected').text()).toBe('20');
    });
  });

  describe('beforeConfirm (async)', () => {
    it('proceeds when an async beforeConfirm resolves true', async () => {
      const w = mountCalendar({ beforeConfirm: async () => true });
      await dayCells(w)[9]?.trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toHaveLength(1);
      expect(w.emitted('update:visible')?.[0]).toEqual([false]);
    });

    it('keeps the sheet open when an async beforeConfirm resolves false', async () => {
      const w = mountCalendar({ beforeConfirm: async () => false });
      await dayCells(w)[9]?.trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      await Promise.resolve();
      await Promise.resolve();
      expect(w.emitted('confirm')).toBeUndefined();
      expect(w.emitted('update:modelValue')).toBeUndefined();
      expect(w.emitted('update:visible')).toBeUndefined();
    });
  });

  describe('shortcuts (extra types)', () => {
    it('wraps the shortcut value in a single-item list for the dates type', async () => {
      const w = mountCalendar({
        type: 'dates',
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      await w.find('.sn-calendar__confirm').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toEqual([JUNE_15]);
    });

    it('writes the draft immediately in immediateChange mode', async () => {
      const w = mountCalendar({
        immediateChange: true,
        shortcuts: [{ text: 'Fixed', value: JUNE_15 }],
      });
      await w.find('.sn-calendar__shortcut').trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toBe(JUNE_15);
    });
  });
});
