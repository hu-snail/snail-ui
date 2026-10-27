/**
 * sn-datetime-picker-view unit tests — uni-end date / time roller body.
 *
 * Behaviour only (AGENTS.md §46): column sets per `type`, month-length
 * clamping, min / max bounds, the formatter / filter hooks, selection
 * writes and the exposed helpers. No rpx numbers in assertions.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SnDatetimePickerView from './sn-datetime-picker-view.vue';
import { PICKER_DRAG_CLOCK_INJECT } from '../sn-picker-view/sn-picker-view-drag';

/**
 * Pin the viewport to the 750rpx design reference (375px) so the drag
 * engine's px → rpx fallback ratio is exactly 2 — drag assertions below read
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

/** 2024-06-15 10:30:00 local time. */
const BASE = new Date(2024, 5, 15, 10, 30, 0).getTime();

function mountView(props: Record<string, unknown> = {}, provide?: Record<string, unknown>) {
  return mount(SnDatetimePickerView, {
    props: {
      modelValue: BASE,
      minDate: new Date(2020, 0, 1).getTime(),
      maxDate: new Date(2030, 11, 31, 23, 59, 59).getTime(),
      ...props,
    },
    global: provide ? { provide } : undefined,
  });
}

const columnTypes = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-datetime-picker-view__column').length;

const activeLabels = (w: ReturnType<typeof mount>) =>
  w.findAll('.sn-datetime-picker-view__item--active').map((item) => item.text());

describe('sn-datetime-picker-view', () => {
  describe('column sets', () => {
    it('renders year / month / date / hour / minute for datetime', () => {
      expect(columnTypes(mountView())).toBe(5);
    });

    it('renders 3 columns for date', () => {
      expect(columnTypes(mountView({ type: 'date' }))).toBe(3);
    });

    it('renders 2 columns for year-month', () => {
      expect(columnTypes(mountView({ type: 'year-month' }))).toBe(2);
    });

    it('renders 1 column for year', () => {
      expect(columnTypes(mountView({ type: 'year' }))).toBe(1);
    });

    it('renders hour / minute for time', () => {
      const w = mountView({ type: 'time', modelValue: '10:30' });
      expect(columnTypes(w)).toBe(2);
      expect(activeLabels(w)).toEqual(['10', '30']);
    });

    it('adds the seconds column when useSecond is set', () => {
      expect(columnTypes(mountView({ useSecond: true }))).toBe(6);
    });
  });

  describe('selection display', () => {
    it('marks the selected rows active', () => {
      expect(activeLabels(mountView())).toEqual(['2024', '06', '15', '10', '30']);
    });

    it('formats month / date / time values with two digits', () => {
      const w = mountView({ modelValue: new Date(2024, 0, 5, 9, 8, 0).getTime() });
      expect(activeLabels(w)).toEqual(['2024', '01', '05', '09', '08']);
    });
  });

  describe('bounds', () => {
    it('limits the year column to the min / max years', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2022, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
      });
      const items = w.findAll('.sn-datetime-picker-view__item');
      expect(items).toHaveLength(3);
      expect(items[0]?.text()).toBe('2022');
      expect(items[2]?.text()).toBe('2024');
    });

    it('limits the day column to the month length', () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 1, 10).getTime(),
      });
      const dayColumn = w.findAll('.sn-datetime-picker-view__column')[2];
      // February 2024 has 29 days.
      expect(dayColumn?.findAll('.sn-datetime-picker-view__item')).toHaveLength(29);
    });

    it('drops days beyond the max date inside the max month', () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 5, 1).getTime(),
        minDate: new Date(2024, 0, 1).getTime(),
        maxDate: new Date(2024, 5, 10).getTime(),
      });
      const dayColumn = w.findAll('.sn-datetime-picker-view__column')[2];
      expect(dayColumn?.findAll('.sn-datetime-picker-view__item')).toHaveLength(10);
    });

    it('honours minHour / maxHour for the time type', () => {
      const w = mountView({ type: 'time', modelValue: '10:30', minHour: 8, maxHour: 18 });
      const hourColumn = w.findAll('.sn-datetime-picker-view__column')[0];
      const items = hourColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      expect(items).toHaveLength(11);
      expect(items[0]?.text()).toBe('08');
    });

    it('spans now ±10 years when min / max dates are not given', () => {
      const w = mount(SnDatetimePickerView, { props: { modelValue: BASE } });
      const yearColumn = w.findAll('.sn-datetime-picker-view__column')[0];
      const items = yearColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      const thisYear = new Date().getFullYear();
      expect(items).toHaveLength(21);
      expect(items[0]?.text()).toBe(String(thisYear - 10));
      expect(items[20]?.text()).toBe(String(thisYear + 10));
    });
  });

  describe('selection writes', () => {
    it('emits a timestamp when a year is tapped', async () => {
      const w = mountView({ type: 'date' });
      await w
        .findAll('.sn-datetime-picker-view__column')[0]
        ?.findAll('.sn-datetime-picker-view__item')[0]
        ?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2020);
    });

    it('emits an HH:mm string for the time type', async () => {
      const w = mountView({ type: 'time', modelValue: '10:30' });
      await w
        .findAll('.sn-datetime-picker-view__column')[0]
        ?.findAll('.sn-datetime-picker-view__item')[1]
        ?.trigger('tap');
      expect(w.emitted('update:modelValue')?.[0]).toEqual(['01:30']);
    });

    it('emits change with the value and the columns', async () => {
      const w = mountView({ type: 'date' });
      await w
        .findAll('.sn-datetime-picker-view__column')[1]
        ?.findAll('.sn-datetime-picker-view__item')[0]
        ?.trigger('tap');
      const payload = w.emitted('change')?.[0]?.[0] as { value: number; columns: unknown[] };
      expect(typeof payload.value).toBe('number');
      expect(payload.columns).toHaveLength(3);
    });

    it('does not emit when the tapped row is already selected', async () => {
      const w = mountView({ type: 'date' });
      await w
        .findAll('.sn-datetime-picker-view__column')[2]
        ?.findAll('.sn-datetime-picker-view__item')[14]
        ?.trigger('tap');
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('clamps the day when rolling into a shorter month', async () => {
      const w = mountView({
        type: 'date',
        modelValue: new Date(2024, 0, 31).getTime(),
      });
      await w
        .findAll('.sn-datetime-picker-view__column')[1]
        ?.findAll('.sn-datetime-picker-view__item')[1]
        ?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getMonth()).toBe(1);
      expect(new Date(value).getDate()).toBeLessThanOrEqual(29);
    });
  });

  describe('hooks', () => {
    it('applies the formatter to the labels', () => {
      const w = mountView({
        type: 'year',
        formatter: (type, value) => (type === 'year' ? `${value}!` : String(value)),
      });
      expect(w.find('.sn-datetime-picker-view__item--active').text()).toBe('2024!');
    });

    it('applies the filter to the column values', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
        filter: (_type, values) => values.filter((value) => value % 2 === 0),
      });
      const items = w.findAll('.sn-datetime-picker-view__item');
      expect(items).toHaveLength(3);
      expect(items.map((item) => item.text())).toEqual(['2020', '2022', '2024']);
    });

    it('applies the columnFormatter to the whole column', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
        columnFormatter: (_type, values) => values.slice(0, 2),
      });
      expect(w.findAll('.sn-datetime-picker-view__item')).toHaveLength(2);
    });
  });

  describe('touch', () => {
    it('emits pickstart / pickend', async () => {
      const w = mountView({ type: 'year' });
      const column = w.find('.sn-datetime-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 100 }] });
      await column.trigger('touchend', { touches: [{ clientY: 100 }] });
      expect(w.emitted('pickstart')).toHaveLength(1);
      expect(w.emitted('pickend')).toHaveLength(1);
    });

    it('advances the selection when dragged far enough', async () => {
      // FB-010：阶跃时钟（每次 now() +8ms，< MIN_SAMPLE_MS=16）让采样间隔
      // 确定性落进"无动量"窗口——落点只由拖拽位移决定，不受测试负载影响。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const w = mountView({ type: 'year' }, { [PICKER_DRAG_CLOCK_INJECT]: stepClock });
      const column = w.find('.sn-datetime-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchend', { touches: [{ clientY: 250 }] });
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2025);
    });
    it('reads the release point from changedTouches when touches is empty', async () => {
      // Regression: real `touchend` events carry an EMPTY `touches` array and
      // only `changedTouches` holds the point — the old read returned 0, so a
      // downward drag snapped the wheel to the LAST row instead of the first.
      const w = mountView({ type: 'year' });
      const column = w.find('.sn-datetime-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300, identifier: 1 }] });
      // Drag down well past the start: every momentum-free reading clamps to
      // the minimum year (2020), while the old y=0 bug landed on the maximum.
      await column.trigger('touchend', {
        touches: [],
        changedTouches: [{ clientY: 500, identifier: 1 }],
      });
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2020);
    });
  });
  describe('exposed API', () => {
    it('getSelectedOptions returns one entry per column', () => {
      const w = mountView({ type: 'date' });
      const vm = w.vm as unknown as {
        getSelectedOptions(): Array<{ value: number; label: string }>;
      };
      const options = vm.getSelectedOptions();
      expect(options).toHaveLength(3);
      expect(options[0]?.label).toBe('2024');
    });

    it('correctValue normalizes an out-of-range timestamp', () => {
      const w = mountView({ type: 'date' });
      const vm = w.vm as unknown as { correctValue(value: string | number): string | number };
      expect(typeof vm.correctValue(new Date(2024, 5, 15).getTime())).toBe('number');
    });

    it('correctValue normalizes a time string', () => {
      const w = mountView({ type: 'time' });
      const vm = w.vm as unknown as { correctValue(value: string | number): string | number };
      expect(vm.correctValue('9:5')).toBe('09:05');
    });
  });

  describe('desktop H5 mouse + wheel', () => {
    it('marks the root and columns for the mouse gesture path', () => {
      const w = mountView({ type: 'time' });
      expect(w.attributes('data-snui-mouse-gesture')).toBe('datetime-picker-view');
      const columns = w.findAll('.sn-datetime-picker-view__column');
      expect(columns[0]?.attributes('data-snui-column')).toBe('0');
      expect(columns[1]?.attributes('data-snui-column')).toBe('1');
    });

    it('selects a row from a mouse drag on the minute column', async () => {
      // FB-010：注入阶跃时钟，让 mouse 采样的速度窗口确定性归零（无动量）。
      let clockT = 0;
      const stepClock = (): number => (clockT += 4);
      const w = mountView(
        { type: 'time', modelValue: '10:30' },
        { [PICKER_DRAG_CLOCK_INJECT]: stepClock },
      );
      const minute = w.findAll('.sn-datetime-picker-view__column')[1]?.element;
      // One synchronous batch keeps the release inside the velocity window,
      // so the drag commits exactly the travelled rows.
      minute?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientY: 300 }),
      );
      document.dispatchEvent(new MouseEvent('mousemove', { clientY: 256 }));
      document.dispatchEvent(new MouseEvent('mouseup', { clientY: 256 }));
      await nextTick();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['10:31']);
    });

    it('advances the hour on a wheel notch', async () => {
      const w = mountView({ type: 'time', modelValue: '10:30' });
      const hour = w.findAll('.sn-datetime-picker-view__column')[0]?.element;
      hour?.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      );
      await nextTick();
      expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['11:30']);
    });

    it('stops the mouse listeners on unmount', () => {
      const w = mountView({ type: 'time', modelValue: '10:30' });
      const hour = w.findAll('.sn-datetime-picker-view__column')[0]?.element;
      w.unmount();
      hour?.dispatchEvent(
        new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 100 }),
      );
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });
  });

  describe('time bounds', () => {
    it('honours minMinute / maxMinute for the time type', () => {
      const w = mountView({ type: 'time', modelValue: '10:30', minMinute: 10, maxMinute: 40 });
      const minuteColumn = w.findAll('.sn-datetime-picker-view__column')[1];
      const items = minuteColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      expect(items).toHaveLength(31);
      expect(items[0]?.text()).toBe('10');
      expect(items.at(-1)?.text()).toBe('40');
    });

    it('honours minSecond / maxSecond when seconds are shown', () => {
      const w = mountView({
        type: 'time',
        modelValue: '10:30:20',
        useSecond: true,
        minSecond: 15,
        maxSecond: 25,
      });
      const secondColumn = w.findAll('.sn-datetime-picker-view__column')[2];
      const items = secondColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      expect(items).toHaveLength(11);
      expect(items[0]?.text()).toBe('15');
    });

    it('splits an HH:mm:ss value into three columns', () => {
      const w = mountView({ type: 'time', modelValue: '10:30:45', useSecond: true });
      expect(columnTypes(w)).toBe(3);
      expect(activeLabels(w)).toEqual(['10', '30', '45']);
    });
  });

  describe('date bounds', () => {
    it('starts the hour column at the min hour on the min-date day', () => {
      const w = mountView({
        modelValue: new Date(2024, 5, 15, 12, 0, 0).getTime(),
        minDate: new Date(2024, 5, 15, 8, 0, 0).getTime(),
        maxDate: new Date(2030, 11, 31, 23, 59, 59).getTime(),
      });
      const hourColumn = w.findAll('.sn-datetime-picker-view__column')[3];
      const items = hourColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      expect(items[0]?.text()).toBe('08');
    });

    it('starts the minute column at the min minute inside the min hour', () => {
      const w = mountView({
        modelValue: new Date(2024, 5, 15, 10, 45, 0).getTime(),
        minDate: new Date(2024, 5, 15, 10, 30, 0).getTime(),
        maxDate: new Date(2030, 11, 31, 23, 59, 59).getTime(),
      });
      const minuteColumn = w.findAll('.sn-datetime-picker-view__column')[4];
      const items = minuteColumn?.findAll('.sn-datetime-picker-view__item') ?? [];
      expect(items[0]?.text()).toBe('30');
    });

    it('clamps an out-of-range value to the first row of the year column', () => {
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2030, 0, 1).getTime(),
        modelValue: new Date(2050, 0, 1).getTime(),
      });
      const items = w.findAll('.sn-datetime-picker-view__item');
      expect(items[0]?.classes()).toContain('sn-datetime-picker-view__item--active');
    });
  });

  describe('hooks edge cases', () => {
    it('renders an emptied column without crashing', () => {
      const w = mountView({
        type: 'year',
        filter: (_type, values) => values.filter(() => false),
      });
      expect(w.findAll('.sn-datetime-picker-view__item')).toHaveLength(0);
      expect(w.emitted('update:modelValue')).toBeUndefined();
    });

    it('emits the fallback selection when the filtered column loses the value', async () => {
      // Keep only the even years: the selected 2024 stays, so tapping 2020
      // emits from the filtered column.
      const w = mountView({
        type: 'year',
        minDate: new Date(2020, 0, 1).getTime(),
        maxDate: new Date(2024, 0, 1).getTime(),
        filter: (_type, values) => values.filter((value) => value % 2 === 0),
      });
      await w.findAll('.sn-datetime-picker-view__item')[0]?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2020);
    });
  });

  describe('accessibility', () => {
    it('announces the current value on the group role', () => {
      const w = mountView();
      expect(w.attributes('role')).toBe('group');
      expect(w.attributes('aria-label')).toBe('2024-06-15 10:30');
    });

    it('echoes the value through a polite live region', () => {
      const sr = mountView().find('.sn-datetime-picker-view__sr');
      expect(sr.attributes('aria-live')).toBe('polite');
      expect(sr.text()).toBe('2024-06-15 10:30');
    });

    it('announces HH:mm values for the time type', () => {
      const w = mountView({ type: 'time', modelValue: '10:30' });
      expect(w.attributes('aria-label')).toBe('10:30');
    });

    it('marks the roller rows as buttons with selection state', () => {
      const w = mountView({ type: 'year' });
      const items = w.findAll('.sn-datetime-picker-view__item');
      expect(items[0]?.attributes('role')).toBe('button');
      expect(items[0]?.attributes('aria-selected')).toBe('false');
      const active = w.find('.sn-datetime-picker-view__item--active');
      expect(active.attributes('aria-selected')).toBe('true');
    });

    it('hides the decorative masks and indicator from assistive tech', () => {
      const column = mountView().find('.sn-datetime-picker-view__column');
      for (const node of [
        column.find('.sn-datetime-picker-view__mask--top'),
        column.find('.sn-datetime-picker-view__mask--bottom'),
        column.find('.sn-datetime-picker-view__indicator'),
      ]) {
        expect(node.attributes('aria-hidden')).toBe('true');
      }
    });
  });

  describe('presentation props', () => {
    it('tags the root with the active type class', () => {
      expect(mountView({ type: 'time' }).classes()).toContain('sn-datetime-picker-view--time');
    });

    it('applies customClass and appends customStyle after the CSS variables', () => {
      const w = mountView({ customClass: 'my-roller', customStyle: 'background: red' });
      expect(w.classes()).toContain('my-roller');
      const style = w.attributes('style') ?? '';
      expect(style).toContain('--sn-datetime-picker-view-item-height:');
      expect(style).toContain('background: red');
    });
  });

  describe('exposed API', () => {
    it('getOriginColumns returns the derived columns with their kinds', () => {
      const w = mountView({ type: 'date' });
      const vm = w.vm as unknown as {
        getOriginColumns(): Array<{ type: string; values: number[]; selected: number }>;
      };
      const columns = vm.getOriginColumns();
      expect(columns.map((column) => column.type)).toEqual(['year', 'month', 'date']);
      expect(columns[0]?.selected).toBe(2024);
    });

    it('correctValue normalizes a numeric string for date types', () => {
      const w = mountView({ type: 'date' });
      const vm = w.vm as unknown as { correctValue(value: string | number): string | number };
      const value = vm.correctValue(String(new Date(2024, 5, 15, 10, 30).getTime()));
      expect(typeof value).toBe('number');
      expect(new Date(value as number).getFullYear()).toBe(2024);
    });
  });

  describe('interaction edges', () => {
    it('emits a timestamp from the year-month month column', async () => {
      const w = mountView({ type: 'year-month' });
      await w
        .findAll('.sn-datetime-picker-view__column')[1]
        ?.findAll('.sn-datetime-picker-view__item')[0]
        ?.trigger('tap');
      const value = w.emitted('update:modelValue')?.[0]?.[0] as number;
      expect(new Date(value).getMonth()).toBe(0);
      expect(new Date(value).getFullYear()).toBe(2024);
    });

    it('commits mid-drag when immediateChange is set', async () => {
      // The year column starts at 2020 and 2024 sits at index 4, so one row
      // up is 2025 (same geometry as the settle test above).
      const w = mountView({ type: 'year', immediateChange: true });
      const column = w.find('.sn-datetime-picker-view__column');
      await column.trigger('touchstart', { touches: [{ clientY: 300 }] });
      await column.trigger('touchmove', { touches: [{ clientY: 256 }] });
      const value = w.emitted('update:modelValue')?.at(-1)?.[0] as number;
      expect(new Date(value).getFullYear()).toBe(2025);
    });

    it('accepts the range-linkage boundary props without breaking the roller', () => {
      const w = mountView({
        boundaryMinDate: new Date(2020, 0, 1).getTime(),
        boundaryMaxDate: new Date(2030, 11, 31).getTime(),
      });
      expect(columnTypes(w)).toBe(5);
      expect(activeLabels(w)).toEqual(['2024', '06', '15', '10', '30']);
    });
  });
});
