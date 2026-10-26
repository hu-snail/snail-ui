import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnCalendar from './SnCalendar.vue';
import {
  addDays,
  addMonths,
  buildCalendarCells,
  daysInMonth,
  formatIsoDate,
  panelInfoOf,
  startOfDay,
  startOfMonth,
  WEEKDAY_SHORT_LABELS,
  weekdayIndexOf,
} from './date-grid';

/** Local timestamp for a calendar day (month is 0-based). */
function day(year: number, month0: number, date: number): number {
  return new Date(year, month0, date).getTime();
}

/** Mount SnCalendar through a wrapper component, mirroring real usage. */
function mountCalendar(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnCalendar },
      setup() {
        return () => h(SnCalendar, props as never, slots as never);
      },
    }),
  );
}

/** Find a grid cell by its iso title ('2026-03-15'). */
function findCellByIso(wrapper: ReturnType<typeof mountCalendar>, iso: string) {
  return wrapper
    .findAll('.sn-calendar__cell')
    .find((cell) => cell.find(`.sn-calendar__date-num[title="${iso}"]`).exists());
}

describe('SnCalendar date-grid utils', () => {
  describe('buildCalendarCells', () => {
    it('should build a 42-cell grid when a month needs six rows (2026-03)', () => {
      const cells = buildCalendarCells(day(2026, 2, 15), null, Date.now());
      expect(cells).toHaveLength(42);
      // 2026-03-01 is a Sunday → 6 leading cells; grid starts Mon 2026-02-23.
      expect(cells[0]?.iso).toBe('2026-02-23');
      expect(cells[0]?.inCurrentMonth).toBe(false);
      expect(cells[41]?.iso).toBe('2026-04-05');
    });

    it('should clamp the grid to 35 cells for a 5-row month (2026-02)', () => {
      const cells = buildCalendarCells(day(2026, 1, 15), null, Date.now());
      expect(cells).toHaveLength(35);
      // 2026-02-01 is a Sunday, 28 days → grid Jan 26 … Mar 1.
      expect(cells[0]?.iso).toBe('2026-01-26');
      expect(cells[34]?.iso).toBe('2026-03-01');
    });

    it('should render a 28-cell month without extra padding (2021-02)', () => {
      const cells = buildCalendarCells(day(2021, 1, 15), null, Date.now());
      expect(cells).toHaveLength(28);
      expect(cells[0]?.iso).toBe('2021-02-01');
      expect(cells[27]?.iso).toBe('2021-02-28');
    });

    it('should include the leap day of a leap year (2024-02)', () => {
      const cells = buildCalendarCells(day(2024, 1, 15), null, Date.now());
      expect(daysInMonth(2024, 1)).toBe(29);
      const leap = cells.find((cell) => cell.month === 2 && cell.date === 29);
      expect(leap).toBeDefined();
      expect(leap?.inCurrentMonth).toBe(true);
    });

    it('should mark cells of the anchor month and gray the others', () => {
      const cells = buildCalendarCells(day(2026, 2, 15), null, Date.now());
      const mar15 = cells.find((cell) => cell.iso === '2026-03-15');
      expect(mar15?.inCurrentMonth).toBe(true);
      const feb23 = cells.find((cell) => cell.iso === '2026-02-23');
      expect(feb23?.inCurrentMonth).toBe(false);
    });

    it('should mark today and the selected day (time-of-day ignored)', () => {
      const nowTs = day(2026, 2, 15);
      const valueTs = day(2026, 2, 10) + 18 * 3600_000;
      const cells = buildCalendarCells(day(2026, 2, 15), valueTs, nowTs);
      expect(cells.find((cell) => cell.isCurrentDate)?.date).toBe(15);
      const selected = cells.filter((cell) => cell.selected);
      expect(selected).toHaveLength(1);
      expect(selected[0]?.date).toBe(10);
    });

    it('should flag cells rejected by the isDateDisabled predicate', () => {
      const cells = buildCalendarCells(
        day(2026, 2, 15),
        null,
        Date.now(),
        (ts) => ts === day(2026, 2, 1),
      );
      expect(cells.find((cell) => cell.iso === '2026-03-01')?.disabled).toBe(true);
      expect(cells.find((cell) => cell.iso === '2026-03-02')?.disabled).toBe(false);
    });

    it('should label the first row with Monday-first weekday names', () => {
      const cells = buildCalendarCells(day(2026, 2, 15), null, Date.now());
      expect(cells[0]?.weekdayLabel).toBe('周一');
      expect(cells[6]?.weekdayLabel).toBe('周日');
      expect(WEEKDAY_SHORT_LABELS[weekdayIndexOf(day(2026, 2, 23))]).toBe('周一');
    });
  });

  describe('addMonths', () => {
    it('should clamp the day-of-month at month end (Jan 31 + 1 → Feb 28)', () => {
      expect(formatIsoDate(addMonths(day(2026, 0, 31), 1))).toBe('2026-02-28');
    });

    it('should clamp onto the leap day (Jan 31 2024 + 1 → Feb 29)', () => {
      expect(formatIsoDate(addMonths(day(2024, 0, 31), 1))).toBe('2024-02-29');
    });

    it('should cross the year boundary in both directions', () => {
      expect(formatIsoDate(addMonths(day(2026, 11, 15), 1))).toBe('2027-01-15');
      expect(formatIsoDate(addMonths(day(2026, 0, 15), -1))).toBe('2025-12-15');
    });
  });

  describe('formatIsoDate / panelInfoOf', () => {
    it('should zero-pad month and day', () => {
      expect(formatIsoDate(day(2026, 0, 5))).toBe('2026-01-05');
      expect(formatIsoDate(day(2026, 10, 25))).toBe('2026-11-25');
    });

    it('should report 1-based panel months', () => {
      expect(panelInfoOf(day(2026, 0, 20))).toEqual({ year: 2026, month: 1 });
      expect(panelInfoOf(startOfMonth(day(2026, 11, 3)))).toEqual({ year: 2026, month: 12 });
    });
  });

  describe('startOfDay / addDays', () => {
    it('should drop the time-of-day', () => {
      const noon = day(2026, 2, 15) + 12 * 3600_000;
      expect(startOfDay(noon)).toBe(day(2026, 2, 15));
    });

    it('should cross month and year boundaries', () => {
      expect(formatIsoDate(addDays(day(2026, 2, 31), 1))).toBe('2026-04-01');
      expect(formatIsoDate(addDays(day(2026, 11, 31), 1))).toBe('2027-01-01');
      expect(formatIsoDate(addDays(day(2026, 0, 1), -1))).toBe('2025-12-31');
    });
  });
});

describe('SnCalendar (AUI-WEB-DD-001)', () => {
  it('should expose the component root with the BEM class and marker', () => {
    const w = mountCalendar();
    expect(w.find('.sn-calendar').exists()).toBe(true);
    expect(w.find('[data-snui-component="calendar"]').exists()).toBe(true);
  });

  it('should title the header with the panel year and month', () => {
    const now = new Date();
    const w = mountCalendar();
    expect(w.find('.sn-calendar__title').text()).toBe(
      `${now.getFullYear()}年${now.getMonth() + 1}月`,
    );
  });

  it('should anchor the panel on defaultValue and render the expected grid', () => {
    const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
    expect(w.find('.sn-calendar__title').text()).toBe('2026年3月');
    expect(w.findAll('.sn-calendar__cell')).toHaveLength(42);
    expect(w.findAll('.sn-calendar__date-week')).toHaveLength(7);
  });

  it('should preselect defaultValue without a v-model binding', () => {
    const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
    const selected = w.findAll('.sn-calendar__cell--selected');
    expect(selected).toHaveLength(1);
    expect(selected[0]?.find('.sn-calendar__date-num[title="2026-03-15"]').exists()).toBe(true);
    expect(selected[0]?.find('.sn-calendar__bar').exists()).toBe(true);
  });

  it('should mark today with the current-day circle', () => {
    const now = new Date();
    const w = mountCalendar();
    const current = w.findAll('.sn-calendar__cell--current');
    expect(current).toHaveLength(1);
    expect(current[0]?.find('.sn-calendar__date-num').text()).toBe(String(now.getDate()));
  });

  it('should pass year / month / date (1-based) to the default slot', () => {
    const w = mountCalendar(
      { defaultValue: day(2026, 2, 15) },
      {
        default: (cell: { year: number; month: number; date: number }) =>
          `${cell.year}-${cell.month}-${cell.date}`,
      },
    );
    const cell = findCellByIso(w, '2026-03-15');
    expect(cell?.text()).toContain('2026-3-15');
  });

  it('should set the iso title on the date number', () => {
    const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
    expect(w.find('.sn-calendar__date-num[title="2026-03-15"]').exists()).toBe(true);
  });

  describe('selection', () => {
    it('should emit update:value with the timestamp and 1-based date parts', async () => {
      const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
      const cell = findCellByIso(w, '2026-03-15');
      await cell?.trigger('click');

      const emitted = w.findComponent(SnCalendar).emitted('update:value');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]?.[0]).toBe(day(2026, 2, 15));
      expect(emitted?.[0]?.[1]).toEqual({ year: 2026, month: 3, date: 15 });
    });

    it('should support v-model:value', async () => {
      const w = mount(
        defineComponent({
          components: { SnCalendar },
          setup() {
            const value = ref<number | null>(day(2026, 2, 10));
            return () =>
              h(SnCalendar, {
                defaultValue: day(2026, 2, 15),
                value: value.value,
                'onUpdate:value': (ts: number) => {
                  value.value = ts;
                },
              } as never);
          },
        }),
      );

      expect(w.findAll('.sn-calendar__cell--selected')).toHaveLength(1);
      const target = w
        .findAll('.sn-calendar__cell')
        .find((c) => c.find('.sn-calendar__date-num[title="2026-03-15"]').exists());
      await target?.trigger('click');
      await w.vm.$nextTick();

      const selected = w.findAll('.sn-calendar__cell--selected');
      expect(selected).toHaveLength(1);
      expect(selected[0]?.find('.sn-calendar__date-num[title="2026-03-15"]').exists()).toBe(true);
    });

    it('should keep the controlled value when only the prop is bound', async () => {
      const w = mountCalendar({ value: day(2026, 2, 10), defaultValue: day(2026, 2, 15) });
      const target = findCellByIso(w, '2026-03-15');
      await target?.trigger('click');
      await w.vm.$nextTick();

      expect(w.findComponent(SnCalendar).emitted('update:value')).toHaveLength(1);
      const selected = w.findAll('.sn-calendar__cell--selected');
      expect(selected).toHaveLength(1);
      expect(selected[0]?.find('.sn-calendar__date-num[title="2026-03-10"]').exists()).toBe(true);
    });
  });

  describe('is-date-disabled', () => {
    it('should mark disabled cells with the disabled modifiers', () => {
      const w = mountCalendar({
        defaultValue: day(2026, 2, 15),
        isDateDisabled: (ts: number) => ts === day(2026, 2, 1),
      });
      const cell = findCellByIso(w, '2026-03-01');
      expect(cell?.classes()).toContain('sn-calendar__cell--disabled');
      expect(cell?.classes()).toContain('sn-calendar__cell--not-allowed');
      expect(cell?.attributes('aria-disabled')).toBe('true');
    });

    it('should not emit update:value for a disabled cell', async () => {
      const w = mountCalendar({
        defaultValue: day(2026, 2, 15),
        isDateDisabled: (ts: number) => ts === day(2026, 2, 1),
      });
      await findCellByIso(w, '2026-03-01')?.trigger('click');
      expect(w.findComponent(SnCalendar).emitted('update:value')).toBeUndefined();

      await findCellByIso(w, '2026-03-02')?.trigger('click');
      expect(w.findComponent(SnCalendar).emitted('update:value')).toHaveLength(1);
    });
  });

  describe('panel navigation', () => {
    it('should go to the previous month with on-panel-change', async () => {
      const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
      const buttons = w.findAll('.sn-calendar__btn');
      await buttons[0]?.trigger('click');

      expect(w.find('.sn-calendar__title').text()).toBe('2026年2月');
      const emitted = w.findComponent(SnCalendar).emitted('panel-change');
      expect(emitted?.[0]?.[0]).toEqual({ year: 2026, month: 2 });
    });

    it('should go to the next month and change the grid size', async () => {
      const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
      const buttons = w.findAll('.sn-calendar__btn');
      await buttons[2]?.trigger('click');

      expect(w.find('.sn-calendar__title').text()).toBe('2026年4月');
      // 2026-04-01 is a Wednesday → 2 leading (Mar 30-31) + 30 → 35 cells.
      expect(w.findAll('.sn-calendar__cell')).toHaveLength(35);
      expect(w.findComponent(SnCalendar).emitted('panel-change')?.[0]?.[0]).toEqual({
        year: 2026,
        month: 4,
      });
    });

    it('should return to the current month via the today button', async () => {
      const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
      const buttons = w.findAll('.sn-calendar__btn');
      await buttons[2]?.trigger('click');
      await buttons[1]?.trigger('click');

      const now = new Date();
      expect(w.find('.sn-calendar__title').text()).toBe(
        `${now.getFullYear()}年${now.getMonth() + 1}月`,
      );
      // prev-less flow: next + today → exactly two panel changes.
      expect(w.findComponent(SnCalendar).emitted('panel-change')).toHaveLength(2);
    });

    it('should switch the panel and report the change when clicking an out-of-month cell', async () => {
      const w = mountCalendar({ defaultValue: day(2026, 2, 15) });
      const cell = findCellByIso(w, '2026-04-05');
      expect(cell?.classes()).toContain('sn-calendar__cell--other-month');
      await cell?.trigger('click');

      expect(w.find('.sn-calendar__title').text()).toBe('2026年4月');
      expect(w.findComponent(SnCalendar).emitted('panel-change')?.[0]?.[0]).toEqual({
        year: 2026,
        month: 4,
      });
      expect(w.findComponent(SnCalendar).emitted('update:value')?.[0]?.[0]).toBe(day(2026, 3, 5));
    });
  });

  it('should allow overriding the header via the header slot', () => {
    const w = mountCalendar(
      { defaultValue: day(2026, 2, 15) },
      { header: (info: { year: number; month: number }) => `${info.year} / ${info.month}` },
    );
    expect(w.find('.sn-calendar__title').text()).toBe('2026 / 3');
  });

  it('should keep startOfMonth consistent with the grid anchor', () => {
    expect(startOfMonth(day(2026, 2, 15))).toBe(day(2026, 2, 1));
    // startOfMonth(March 1) minus one day = Feb 28 (2026 is not a leap year).
    expect(addDays(startOfMonth(day(2026, 2, 1)), -1)).toBe(day(2026, 1, 28));
  });
});
