/**
 * sn-calendar-view unit tests — uni-end month-grid calendar body.
 *
 * Behaviour only (AGENTS.md §46): month block generation, weekday rotation,
 * single / range / multiple selection writes, disabled bounds, the formatter
 * hook and the switch-mode navigation. No rpx numbers in assertions.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnCalendarView from './sn-calendar-view.vue';

const JUNE_15 = new Date(2024, 5, 15).getTime();

function mountView(props: Record<string, unknown> = {}) {
  return mount(SnCalendarView, {
    props: {
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

describe('sn-calendar-view', () => {
  describe('structure', () => {
    it('renders one month block per month in range', () => {
      const w = mountView({
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(3);
    });

    it('renders the weekday headers starting on Sunday by default', () => {
      const w = mountView();
      expect(w.findAll('.sn-calendar-view__week').map((t) => t.text())).toEqual([
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
      ]);
    });

    it('rotates the weekday headers for firstDayOfWeek', () => {
      const w = mountView({ firstDayOfWeek: 1 });
      expect(w.findAll('.sn-calendar-view__week').map((t) => t.text())).toEqual([
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '日',
      ]);
    });

    it('renders every day of the month', () => {
      expect(dayCells(mountView())).toHaveLength(30);
    });

    it('renders the month title when showPanelTitle is on', () => {
      expect(mountView().find('.sn-calendar-view__month-title').text()).toBe('2024 年 6 月');
      expect(
        mountView({ showPanelTitle: false }).find('.sn-calendar-view__month-title').exists(),
      ).toBe(false);
    });

    it('pads the grid with filler cells to whole weeks', () => {
      const w = mountView();
      expect(w.findAll('.sn-calendar-view__day').length % 7).toBe(0);
    });

    it('applies the type class', () => {
      expect(mountView({ type: 'daterange' }).classes()).toContain('sn-calendar-view--daterange');
    });
  });

  describe('single selection', () => {
    it('marks the selected day', () => {
      const w = mountView({ modelValue: JUNE_15 });
      const active = w.find('.sn-calendar-view__day--selected');
      expect(active.text()).toBe('15');
      expect(active.attributes('aria-selected')).toBe('true');
    });

    it('emits a timestamp when a day is tapped', async () => {
      const w = mountView();
      await dayCells(w)[10]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getDate()).toBe(11);
    });

    it('applies defaultTime to the emitted timestamp', async () => {
      const w = mountView({ defaultTime: '09:30:00' });
      await dayCells(w)[10]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      const d = new Date(value);
      expect(d.getHours()).toBe(9);
      expect(d.getMinutes()).toBe(30);
    });

    it('emits change alongside update:modelValue', async () => {
      const w = mountView();
      await dayCells(w)[10]?.trigger('tap');
      expect(w.emitted('change')).toHaveLength(1);
    });
  });

  describe('range selection', () => {
    it('marks the start and end days', () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 20).getTime()],
      });
      expect(w.findAll('.sn-calendar-view__day--start')).toHaveLength(1);
      expect(w.findAll('.sn-calendar-view__day--end')).toHaveLength(1);
    });

    it('marks the days in between as middle', () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 10).getTime()],
      });
      // 6, 7, 8, 9 → four middle days.
      expect(w.findAll('.sn-calendar-view__day--middle')).toHaveLength(4);
    });

    it('starts a new range when the second endpoint is already set', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 20).getTime()],
      });
      await dayCells(w)[9]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0] as number[]).toHaveLength(1);
    });

    it('orders the endpoints when tapped backwards', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 20).getTime()],
      });
      await dayCells(w)[4]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[];
      expect(new Date(value[0] ?? 0).getDate()).toBe(5);
      expect(new Date(value[1] ?? 0).getDate()).toBe(20);
    });

    it('refuses a range wider than maxRange', async () => {
      const w = mountView({
        type: 'daterange',
        maxRange: 3,
        modelValue: [new Date(2024, 5, 1).getTime()],
      });
      await dayCells(w)[14]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('allows the same day when allowSameDay is set', async () => {
      const w = mountView({
        type: 'daterange',
        allowSameDay: true,
        modelValue: [new Date(2024, 5, 10).getTime()],
      });
      await dayCells(w)[9]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[];
      expect(value[0]).toBe(value[1]);
    });

    it('renders the range prompt hint when maxRange is set', () => {
      const w = mountView({ type: 'daterange', maxRange: 7, rangePrompt: 'too far' });
      expect(w.find('.sn-calendar-view__hint').text()).toBe('too far');
    });
  });

  describe('multiple selection', () => {
    it('adds a day to the selection', async () => {
      const w = mountView({ type: 'dates', modelValue: [] });
      await dayCells(w)[4]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0] as number[]).toHaveLength(1);
    });

    it('removes an already selected day', async () => {
      const w = mountView({
        type: 'dates',
        modelValue: [new Date(2024, 5, 5).getTime()],
      });
      await dayCells(w)[4]?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]?.[0]).toEqual([]);
    });

    it('marks selected days', () => {
      const w = mountView({
        type: 'dates',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 9).getTime()],
      });
      expect(w.findAll('.sn-calendar-view__day--selected')).toHaveLength(2);
    });
  });

  describe('bounds + formatter', () => {
    it('disables days before minDate', () => {
      const w = mountView({
        minDate: new Date(2024, 5, 10).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
      });
      const disabled = dayCells(w).filter((cell) =>
        cell.classes().includes('sn-calendar-view__day--disabled'),
      );
      expect(disabled).toHaveLength(9);
    });

    it('does not emit for a disabled day', async () => {
      const w = mountView({
        minDate: new Date(2024, 5, 10).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
      });
      await dayCells(w)[0]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('applies the formatter text / topInfo / bottomInfo', () => {
      const w = mountView({
        formatter: (day) =>
          day.text === '15'
            ? { text: 'Fifteenth', topInfo: 'today', bottomInfo: 'mid' }
            : undefined,
      });
      const cell = w.findAll('.sn-calendar-view__day').find((c) => c.text().includes('Fifteenth'));
      expect(cell).toBeTruthy();
      expect(cell?.text()).toContain('today');
    });

    it('lets the formatter disable a day', async () => {
      const w = mountView({
        formatter: (day) => (day.text === '15' ? { disabled: true } : undefined),
      });
      const disabled = w.findAll('.sn-calendar-view__day--disabled');
      expect(disabled.length).toBeGreaterThan(0);
    });
  });

  describe('switch modes', () => {
    it('renders every month in none mode', () => {
      const w = mountView({
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(3);
    });

    it('renders a single month plus controls in month mode', () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      expect(w.findAll('.sn-calendar-view__month')).toHaveLength(1);
      expect(w.find('.sn-calendar-view__controls').exists()).toBe(true);
    });

    it('advances the active month with the next control', async () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      await w.find('.sn-calendar-view__control--next').trigger('tap');
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 6 月');
    });

    it('shows the next-year control only in year-month mode', () => {
      const w = mountView({ switchMode: 'year-month' });
      expect(w.find('.sn-calendar-view__control--next-year').exists()).toBe(true);
      expect(
        mountView({ switchMode: 'month' }).find('.sn-calendar-view__control--next-year').exists(),
      ).toBe(false);
    });
  });

  describe('exposed API', () => {
    it('shiftMonth / shiftYear / jumpToToday do not throw', () => {
      const w = mountView({
        switchMode: 'year-month',
        minDate: new Date(2023, 0, 1).getTime(),
        maxDate: new Date(2025, 11, 31).getTime(),
      });
      const vm = w.vm as unknown as {
        shiftMonth(delta: number): void;
        shiftYear(delta: number): void;
        jumpToToday(): void;
      };
      expect(() => {
        vm.shiftMonth(1);
      }).not.toThrow();
      expect(() => {
        vm.shiftYear(1);
      }).not.toThrow();
      expect(() => {
        vm.jumpToToday();
      }).not.toThrow();
    });
  });

  /* ── wd-calendar-view parity props (declared, no time roller) ────────── */

  it('accepts the time-roller parity props without changing the month grid', () => {
    const w = mountView({
      type: 'datetime',
      timeFilter: (type: string) => type !== 'second',
      timeItemHeight: 48,
      timeVisibleItemCount: 5,
      hideSecond: true,
    });
    expect(dayCells(w)).toHaveLength(30);
    expect(w.findAll('.sn-calendar-view__month')).toHaveLength(1);
  });

  /*
   * Untestable in happy-dom:
   *   - `pickstart` / `pickend` are declared parity events with no trigger
   *     path in this build (no time roller is rendered), so there is no
   *     behaviour to assert.
   *   - Actual scrolling driven by `scroll-into-view` is native scroll-view
   *     behaviour; only the attribute hand-off is asserted here.
   */

  describe('calendar math', () => {
    it('renders 29 days for a leap-year February', () => {
      const w = mountView({
        minDate: new Date(2024, 1, 1).getTime(),
        maxDate: new Date(2024, 1, 29).getTime(),
      });
      expect(dayCells(w)).toHaveLength(29);
    });

    it('renders 28 days for a non-leap February', () => {
      const w = mountView({
        minDate: new Date(2023, 1, 1).getTime(),
        maxDate: new Date(2023, 1, 28).getTime(),
      });
      expect(dayCells(w)).toHaveLength(28);
    });

    it('spans blocks across a year boundary', () => {
      const w = mountView({
        minDate: new Date(2023, 11, 1).getTime(),
        maxDate: new Date(2024, 1, 29).getTime(),
      });
      const titles = w.findAll('.sn-calendar-view__month-title').map((t) => t.text());
      expect(titles).toEqual(['2023 年 12 月', '2024 年 1 月', '2024 年 2 月']);
    });

    it('offsets the grid by firstDayOfWeek', () => {
      // June 1st 2024 is a Saturday; a Monday-first grid pads 5 fillers.
      const w = mountView({ firstDayOfWeek: 1 });
      const cells = w.findAll('.sn-calendar-view__day');
      const firstReal = cells.findIndex((cell) => !cell.classes().includes('sn-calendar-view__day--filler'));
      expect(firstReal).toBe(5);
      expect(cells[firstReal]?.text()).toBe('1');
    });

    it('rings today with the today class', () => {
      const today = new Date();
      const first = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime();
      const w = mountView({ minDate: first, maxDate: last });
      const marked = w.findAll('.sn-calendar-view__day--today');
      expect(marked).toHaveLength(1);
      expect(marked[0]?.text()).toBe(String(today.getDate()));
    });
  });

  describe('range extras', () => {
    it('marks a range that crosses the month boundary', () => {
      const w = mountView({
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
        type: 'daterange',
        modelValue: [new Date(2024, 4, 28).getTime(), new Date(2024, 5, 3).getTime()],
      });
      const blocks = w.findAll('.sn-calendar-view__month');
      expect(blocks[0]?.find('.sn-calendar-view__day--start').text()).toBe('28');
      expect(blocks[1]?.find('.sn-calendar-view__day--end').text()).toBe('3');
    });

    it('accepts a span exactly equal to maxRange', async () => {
      const w = mountView({
        type: 'daterange',
        maxRange: 3,
        modelValue: [new Date(2024, 5, 1).getTime()],
      });
      await dayCells(w)[2]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[];
      expect(new Date(value[0] ?? 0).getDate()).toBe(1);
      expect(new Date(value[1] ?? 0).getDate()).toBe(3);
    });

    it('ignores re-tapping the pending start when allowSameDay is off (regression)', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 10).getTime()],
      });
      await dayCells(w)[9]?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('restarts the range when the second endpoint is re-tapped', async () => {
      const w = mountView({
        type: 'daterange',
        modelValue: [new Date(2024, 5, 5).getTime(), new Date(2024, 5, 20).getTime()],
      });
      await dayCells(w)[19]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[];
      expect(value).toHaveLength(1);
      expect(new Date(value[0] ?? 0).getDate()).toBe(20);
    });
  });

  describe('defaultTime parsing', () => {
    it('accepts the array form and uses the first entry', async () => {
      const w = mountView({ defaultTime: ['08:15:30', '20:00:00'] });
      await dayCells(w)[10]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      const d = new Date(value);
      expect(d.getHours()).toBe(8);
      expect(d.getMinutes()).toBe(15);
      expect(d.getSeconds()).toBe(30);
    });

    it('parses an hour:minute pair without seconds', async () => {
      const w = mountView({ defaultTime: '09:30' });
      await dayCells(w)[10]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      const d = new Date(value);
      expect(d.getHours()).toBe(9);
      expect(d.getMinutes()).toBe(30);
      expect(d.getSeconds()).toBe(0);
    });

    it('falls back to midnight for an unparseable defaultTime', async () => {
      const w = mountView({ defaultTime: 'whenever' });
      await dayCells(w)[10]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      const d = new Date(value);
      expect(d.getHours()).toBe(0);
      expect(d.getMinutes()).toBe(0);
    });
  });

  describe('type surface', () => {
    it('marks the month type selection on the first of the month', () => {
      const w = mountView({ type: 'month', modelValue: new Date(2024, 5, 1).getTime() });
      const selected = w.findAll('.sn-calendar-view__day--selected');
      expect(selected).toHaveLength(1);
      expect(selected[0]?.text()).toBe('1');
    });

    it('flags the datetime type with the is-datetime class', () => {
      expect(mountView({ type: 'datetime' }).classes()).toContain('sn-calendar-view--is-datetime');
    });

    it('sorts a multiple selection ascending after adding an earlier day', async () => {
      const w = mountView({
        type: 'dates',
        modelValue: [new Date(2024, 5, 10).getTime()],
      });
      await dayCells(w)[4]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number[];
      expect(new Date(value[0] ?? 0).getDate()).toBe(5);
      expect(new Date(value[1] ?? 0).getDate()).toBe(10);
    });
  });

  describe('accessibility', () => {
    it('exposes the day number as the accessible name and keeps cells focusable', () => {
      const w = mountView();
      const cell = dayCells(w)[14];
      expect(cell?.attributes('role')).toBe('button');
      expect(cell?.attributes('aria-label')).toBe('15');
      expect(cell?.attributes('tabindex')).toBe('0');
    });

    it('marks disabled and filler cells inert', () => {
      const w = mountView({
        minDate: new Date(2024, 5, 10).getTime(),
        maxDate: new Date(2024, 5, 30).getTime(),
      });
      const disabled = w.findAll('.sn-calendar-view__day--disabled')[0];
      expect(disabled?.attributes('aria-disabled')).toBe('true');
      expect(disabled?.attributes('tabindex')).toBe('-1');
      const filler = w.find('.sn-calendar-view__day--filler');
      expect(filler.attributes('aria-label')).toBe('');
      expect(filler.attributes('tabindex')).toBe('-1');
    });

    it('labels the root group with the type', () => {
      expect(mountView({ type: 'daterange' }).attributes('role')).toBe('group');
      expect(mountView({ type: 'daterange' }).attributes('aria-label')).toBe('daterange');
    });
  });

  describe('navigation extras', () => {
    it('targets the active month through scroll-into-view', async () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      expect(w.find('.sn-calendar-view__panel').attributes('scroll-into-view')).toBe(
        'sn-calendar-view-month-2024-05',
      );
      await w.find('.sn-calendar-view__control--next').trigger('tap');
      expect(w.find('.sn-calendar-view__panel').attributes('scroll-into-view')).toBe(
        'sn-calendar-view-month-2024-06',
      );
    });

    it('stays on the first month when prev is tapped at the boundary', async () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      await w.find('.sn-calendar-view__control--prev').trigger('tap');
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 5 月');
    });

    it('returns to the previous month with the prev control', async () => {
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      await w.find('.sn-calendar-view__control--next').trigger('tap');
      await w.find('.sn-calendar-view__control--prev').trigger('tap');
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 5 月');
    });

    it('jumps a whole year with the next-year control', async () => {
      const w = mountView({
        switchMode: 'year-month',
        minDate: new Date(2023, 0, 1).getTime(),
        maxDate: new Date(2025, 11, 31).getTime(),
      });
      await w.find('.sn-calendar-view__control--next-year').trigger('tap');
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 1 月');
    });

    it('keeps the current month when the next-year target is out of bounds', async () => {
      const w = mountView({
        switchMode: 'year-month',
        minDate: new Date(2024, 4, 1).getTime(),
        maxDate: new Date(2024, 6, 31).getTime(),
      });
      await w.find('.sn-calendar-view__control--next-year').trigger('tap');
      expect(w.find('.sn-calendar-view__month-title').text()).toBe('2024 年 5 月');
    });

    it('exposes jumpToToday to move the active month to today', async () => {
      const today = new Date();
      const w = mountView({
        switchMode: 'month',
        minDate: new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime(),
        maxDate: new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime(),
      });
      const vm = w.vm as unknown as { jumpToToday(): void };
      vm.jumpToToday();
      await w.vm.$nextTick();
      expect(w.find('.sn-calendar-view__month-title').text()).toBe(
        `${today.getFullYear()} 年 ${today.getMonth() + 1} 月`,
      );
    });
  });

  describe('root forwarding', () => {
    it('forwards customClass and customStyle on the root', () => {
      const w = mountView({ customClass: 'my-view', customStyle: 'margin: 8px;' });
      expect(w.classes()).toContain('my-view');
      expect(w.attributes('style')).toContain('margin: 8px');
    });
  });

  describe('showLunar (additive)', () => {
    it('renders the lunar day name under each day cell', () => {
      const w = mountView({ showLunar: true });
      const cells = dayCells(w);
      // 2024-06-15 = 甲辰年五月初十。
      expect(cells[14]?.find('.sn-calendar-view__day-info--bottom').text()).toBe('初十');
    });

    it('shows the lunar month name on 初一 (incl. leap months)', () => {
      const w = mountView({
        showLunar: true,
        minDate: new Date(2025, 6, 1).getTime(),
        maxDate: new Date(2025, 6, 31).getTime(),
      });
      const cells = dayCells(w);
      // 2025-07-25 = 乙巳年闰六月初一（当月第 25 格）。
      expect(cells[24]?.find('.sn-calendar-view__day-info--bottom').text()).toBe('闰六月');
    });

    it('lets the formatter override the lunar caption', () => {
      const w = mountView({
        showLunar: true,
        formatter: (item: { date: number; bottomInfo: string }) =>
          item.date === new Date(2024, 5, 15).getTime()
            ? { ...item, bottomInfo: '自定义' }
            : item,
      });
      const cells = dayCells(w);
      expect(cells[14]?.find('.sn-calendar-view__day-info--bottom').text()).toBe('自定义');
      expect(cells[15]?.find('.sn-calendar-view__day-info--bottom').text()).toBe('十一');
    });

    it('renders no bottom caption by default', () => {
      const w = mountView();
      expect(w.find('.sn-calendar-view__day-info--bottom').exists()).toBe(false);
    });
  });
});
