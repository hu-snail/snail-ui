/**
 * SnDatePicker unit tests — web-end date picker (naive-ui parity).
 *
 * Behavior-focused (AGENTS.md §46): v-model round-trip, month grid,
 * month/year modes, datetime columns, range double-pick + swap, format
 * display, clearable, disabled / readonly, keyboard (arrow move, paging,
 * Enter, Esc), month paging, aria, outside click, listener cleanup.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import SnDatePicker from './SnDatePicker.vue';
import { buildMonthGrid, formatDecadeTitle, formatDate, isSameDay } from './sn-date-picker-types';

/** Mounted wrappers tracked so afterEach can unmount before clearing body. */
const mounted: Array<{ unmount: () => void }> = [];

/** Mount helper with default options. */
function mountPicker(props: Record<string, unknown> = {}) {
  const w = mount(SnDatePicker, {
    props,
    attachTo: document.body,
  });
  mounted.push(w);
  return w;
}

/** Mount with a live v-model so commits round-trip. */
function mountVModel(
  initial: number | [number, number] | null,
  props: Record<string, unknown> = {},
) {
  const value = ref<number | [number, number] | null>(initial);
  const wrapper = mount(
    {
      setup() {
        return () =>
          h(SnDatePicker, {
            ...props,
            modelValue: value.value,
            'onUpdate:modelValue': (v: number | [number, number] | null) => {
              value.value = v;
            },
          });
      },
    },
    { attachTo: document.body },
  );
  mounted.push(wrapper);
  return { wrapper: wrapper.findComponent(SnDatePicker), value };
}

/** Local-midnight timestamp builder. */
function ts(year: number, month: number, day: number, hour = 0, minute = 0, second = 0): number {
  return new Date(year, month, day, hour, minute, second, 0).getTime();
}

/** Open the panel by clicking the trigger. */
async function openPanel(wrapper: {
  find: (sel: string) => { trigger: (ev: string, o?: unknown) => Promise<void> };
}) {
  await wrapper.find('.sn-date-picker__selection').trigger('click');
  await nextTick();
}

/**
 * Wait out the sn-pop leave transition (150ms + frame timing) so a closed
 * panel is actually gone from the DOM before asserting.
 */
async function panelLeft(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 250));
}

/** The teleported panel element (null when closed). */
function panelEl(): HTMLElement | null {
  return document.body.querySelector<HTMLElement>('.sn-date-picker-panel');
}

/** A day cell by its timestamp data attribute. */
function dayCell(value: number): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(`.sn-date-picker-cell[data-value="${value}"]`);
}

/** A month-view unit cell by value (month idx or year). */
function unitCell(value: number): HTMLElement | null {
  return document.body.querySelector<HTMLElement>(
    `.sn-date-picker-cell--unit[data-value="${value}"]`,
  );
}

/** A time column cell. */
function timeCell(unit: string, value: number, group = 0): HTMLElement | null {
  return (
    document.body.querySelectorAll<HTMLElement>(
      `.sn-date-picker-time-item[data-unit="${unit}"][data-value="${value}"]`,
    )[group] ?? null
  );
}

/** The trigger combobox element. */
function triggerOf(wrapper: {
  find: (sel: string) => {
    trigger: (ev: string, o?: unknown) => Promise<void>;
    attributes: (a: string) => string | undefined;
  };
}) {
  return wrapper.find('.sn-date-picker__selection');
}

/** All calendar blocks currently in the panel (1 or 2). */
function calendarCount(): number {
  return document.body.querySelectorAll('.sn-date-picker-calendar').length;
}

describe('SnDatePicker', () => {
  beforeEach(() => {
    // happy-dom has no layout — give the trigger + panel stable rects.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isPanel = this.classList.contains('sn-date-picker-panel');
      return isPanel
        ? {
            top: 0,
            left: 0,
            width: 280,
            height: 260,
            right: 280,
            bottom: 260,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }
        : {
            top: 300,
            left: 40,
            width: 240,
            height: 32,
            right: 280,
            bottom: 332,
            x: 40,
            y: 300,
            toJSON: () => ({}),
          };
    });
    // Pin "today" so null-model opens land in a known month.
    vi.setSystemTime(new Date(2026, 0, 15, 9, 5, 7));
  });

  afterEach(async () => {
    // Unmount first so Vue removes its own Teleport nodes cleanly (wiping
    // document.body under a live component crashes the patcher).
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  /* ───── pure helpers ───── */

  it('builds a Monday-first 6x7 month grid', () => {
    const grid = buildMonthGrid(2026, 0); // January 2026 starts on Thursday
    expect(grid).toHaveLength(6);
    for (const row of grid) expect(row).toHaveLength(7);
    // 2026-01-01 is Thursday → leading cells Mon 2025-12-29 … Wed 12-31.
    expect(grid[0]?.[0]?.ts).toBe(ts(2025, 11, 29));
    // First January cell is the 4th column.
    expect(grid[0]?.[3]?.day).toBe(1);
    expect(grid[0]?.[3]?.isCurrentMonth).toBe(true);
    expect(grid[0]?.[0]?.isCurrentMonth).toBe(false);
  });

  it('formats dates with the lowercase token set', () => {
    const v = ts(2026, 0, 5, 9, 7, 3);
    expect(formatDate(v, 'yyyy-MM-dd')).toBe('2026-01-05');
    expect(formatDate(v, 'yyyy年M月d日')).toBe('2026年1月5日');
    expect(formatDate(v, 'yy/M/d HH:mm:ss')).toBe('26/1/5 09:07:03');
  });

  it('formats the decade window title', () => {
    expect(formatDecadeTitle(2026)).toBe('2019 - 2030');
  });

  /* ───── display ───── */

  it('shows the placeholder when empty', () => {
    const w = mountPicker({ placeholder: 'Pick a date' });
    expect(w.find('.sn-date-picker__placeholder').text()).toBe('Pick a date');
  });

  it('displays the formatted date for a timestamp', () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5) });
    expect(w.find('.sn-date-picker__value').text()).toBe('2026-01-05');
  });

  it('respects a custom format in the display', () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5), format: 'dd/MM/yyyy' });
    expect(w.find('.sn-date-picker__value').text()).toBe('05/01/2026');
  });

  it('displays both sides in range mode with default placeholders', () => {
    const w = mountPicker({ type: 'daterange' });
    const ph = w.findAll('.sn-date-picker__placeholder');
    expect(ph).toHaveLength(2);
    expect(ph[0]?.text()).toBe('开始日期');
    expect(ph[1]?.text()).toBe('结束日期');
  });

  it('displays both range values', () => {
    const w = mountPicker({ type: 'daterange', modelValue: [ts(2026, 0, 5), ts(2026, 0, 20)] });
    const vals = w.findAll('.sn-date-picker__value');
    expect(vals[0]?.text()).toBe('2026-01-05');
    expect(vals[1]?.text()).toBe('2026-01-20');
  });

  /* ───── date panel ───── */

  it('opens the panel on trigger click with a weekday header and grid', async () => {
    const w = mountPicker();
    expect(panelEl()).toBeNull();
    await openPanel(w);
    expect(panelEl()).not.toBeNull();
    expect(calendarCount()).toBe(1);
    const headers = document.body.querySelectorAll('.sn-date-picker-grid__weekday');
    expect(headers).toHaveLength(7);
    expect(headers[0]?.textContent).toBe('一');
    expect(headers[6]?.textContent).toBe('日');
    expect(document.body.querySelectorAll('.sn-date-picker-cell[role="gridcell"]')).toHaveLength(
      42,
    );
    expect(document.body.querySelector('.sn-date-picker-calendar__title')?.textContent).toBe(
      '2026年1月',
    );
  });

  it('selecting a day cell commits and closes', async () => {
    const { wrapper, value } = mountVModel(null);
    await openPanel(wrapper);
    dayCell(ts(2026, 0, 10))?.click();
    expect(value.value).toBe(ts(2026, 0, 10));
    expect(wrapper.emitted('change')?.at(-1)).toEqual([ts(2026, 0, 10)]);
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('keeps the panel open when clicking a datetime day cell', async () => {
    const w = mountPicker({ type: 'datetime' });
    await openPanel(w);
    dayCell(ts(2026, 0, 10))?.click();
    await nextTick();
    expect(panelEl()).not.toBeNull();
  });

  it('marks the current value cell as selected with aria', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5) });
    await openPanel(w);
    const selected = dayCell(ts(2026, 0, 5));
    expect(selected?.getAttribute('aria-selected')).toBe('true');
    expect(selected?.classList.contains('sn-date-picker-cell--selected')).toBe(true);
    expect(dayCell(ts(2026, 0, 6))?.getAttribute('aria-selected')).toBe('false');
  });

  it('sets aria-expanded on the trigger', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    await openPanel(w);
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  /* ───── month paging ───── */

  it('pages to the next month via the header nav', async () => {
    const w = mountPicker();
    await openPanel(w);
    document.body.querySelectorAll<HTMLButtonElement>('.sn-date-picker-nav')[2]?.click();
    await nextTick();
    expect(document.body.querySelector('.sn-date-picker-calendar__title')?.textContent).toBe(
      '2026年2月',
    );
  });

  it('jumps a year via the double-chevron nav', async () => {
    const w = mountPicker();
    await openPanel(w);
    document.body.querySelectorAll<HTMLButtonElement>('.sn-date-picker-nav')[3]?.click();
    await nextTick();
    expect(document.body.querySelector('.sn-date-picker-calendar__title')?.textContent).toBe(
      '2027年1月',
    );
  });

  it('selects an adjacent-month cell from the grid', async () => {
    const { value } = mountVModel(null);
    await openPanel(mounted[mounted.length - 1] as never);
    // 2026-01 grid starts with 2025-12-29 (other-month cell).
    dayCell(ts(2025, 11, 29))?.click();
    expect(value.value).toBe(ts(2025, 11, 29));
  });

  /* ───── month / year modes ───── */

  it('renders a month-of-year grid in month mode and commits', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'month' });
    await openPanel(wrapper);
    const cells = document.body.querySelectorAll('.sn-date-picker-cell--unit');
    expect(cells).toHaveLength(12);
    expect(cells[0]?.textContent?.trim()).toBe('1月');
    unitCell(2)?.click(); // March
    expect(value.value).toBe(ts(2026, 2, 1));
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('renders a year grid in year mode and commits', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'year' });
    await openPanel(wrapper);
    const cells = document.body.querySelectorAll('.sn-date-picker-cell--unit');
    expect(cells).toHaveLength(12);
    unitCell(2026)?.click();
    expect(value.value).toBe(ts(2026, 0, 1));
  });

  it('displays month and year values with their default formats', () => {
    expect(
      mountPicker({ type: 'month', modelValue: ts(2026, 2, 15) })
        .find('.sn-date-picker__value')
        .text(),
    ).toBe('2026-03');
    expect(
      mountPicker({ type: 'year', modelValue: ts(2026, 2, 15) })
        .find('.sn-date-picker__value')
        .text(),
    ).toBe('2026');
  });

  /* ───── datetime ───── */

  it('renders hour/minute/second columns with 确认 in datetime mode', async () => {
    const w = mountPicker({ type: 'datetime' });
    await openPanel(w);
    expect(document.body.querySelectorAll('.sn-date-picker-time-col')).toHaveLength(3);
    expect(timeCell('hour', 9)).not.toBeNull();
    expect(document.body.querySelector('.sn-date-picker-panel__confirm')).not.toBeNull();
  });

  it('selecting a datetime day then a time cell commits the combination', async () => {
    const { wrapper, value } = mountVModel(ts(2026, 0, 5, 8, 0, 0), { type: 'datetime' });
    await openPanel(wrapper);
    dayCell(ts(2026, 0, 10))?.click();
    expect(value.value).toBe(ts(2026, 0, 10, 8, 0, 0));
    timeCell('hour', 14)?.click();
    timeCell('minute', 30)?.click();
    expect(value.value).toBe(ts(2026, 0, 10, 14, 30, 0));
    // 确认 closes the panel.
    document.body.querySelector<HTMLButtonElement>('.sn-date-picker-panel__confirm')?.click();
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('shows the datetime default format in the trigger', () => {
    expect(
      mountPicker({ type: 'datetime', modelValue: ts(2026, 0, 5, 9, 7, 3) })
        .find('.sn-date-picker__value')
        .text(),
    ).toBe('2026-01-05 09:07:03');
  });

  /* ───── range ───── */

  it('renders two side-by-side calendars in range mode', async () => {
    const w = mountPicker({ type: 'daterange' });
    await openPanel(w);
    expect(calendarCount()).toBe(2);
    const titles = document.body.querySelectorAll('.sn-date-picker-calendar__title');
    expect(titles[0]?.textContent).toBe('2026年1月');
    expect(titles[1]?.textContent).toBe('2026年2月');
  });

  it('commits after picking start then end', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'daterange' });
    await openPanel(wrapper);
    dayCell(ts(2026, 0, 5))?.click();
    expect(value.value).toBeNull(); // first pick alone does not commit
    dayCell(ts(2026, 0, 20))?.click();
    expect(value.value).toEqual([ts(2026, 0, 5), ts(2026, 0, 20)]);
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('swaps when the second pick is before the first', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'daterange' });
    await openPanel(wrapper);
    dayCell(ts(2026, 0, 20))?.click();
    dayCell(ts(2026, 0, 5))?.click();
    expect(value.value).toEqual([ts(2026, 0, 5), ts(2026, 0, 20)]);
  });

  it('highlights the selected range cells with aria', async () => {
    const w = mountPicker({ type: 'daterange', modelValue: [ts(2026, 0, 5), ts(2026, 0, 20)] });
    await openPanel(w);
    expect(dayCell(ts(2026, 0, 5))?.classList.contains('sn-date-picker-cell--start')).toBe(true);
    expect(dayCell(ts(2026, 0, 20))?.classList.contains('sn-date-picker-cell--end')).toBe(true);
    expect(dayCell(ts(2026, 0, 5))?.getAttribute('aria-selected')).toBe('true');
    expect(dayCell(ts(2026, 0, 10))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      true,
    );
    expect(
      dayCell(ts(2026, 0, 10))?.classList.contains('sn-date-picker-cell--in-range') ?? false,
    ).toBe(true);
    expect(dayCell(ts(2026, 1, 10))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      false,
    );
  });

  it('restarting a range pick after a complete selection', async () => {
    const { wrapper, value } = mountVModel([ts(2026, 0, 5), ts(2026, 0, 20)], {
      type: 'daterange',
    });
    await openPanel(wrapper);
    // Panel open with a full value — clicking a day restarts the pick.
    dayCell(ts(2026, 0, 10))?.click();
    expect(value.value).toEqual([ts(2026, 0, 5), ts(2026, 0, 20)]); // not yet committed
    dayCell(ts(2026, 0, 12))?.click();
    expect(value.value).toEqual([ts(2026, 0, 10), ts(2026, 0, 12)]);
  });

  it('previews the pending interval with the in-range background while picking the end date', async () => {
    const { wrapper: w, value } = mountVModel([ts(2026, 0, 5), ts(2026, 0, 20)], {
      type: 'daterange',
    });
    await openPanel(w);
    // Panel opens with a full value — clicking a day restarts the pick:
    // first click sets the new start, no end yet — nothing is in range.
    dayCell(ts(2026, 0, 5))?.click();
    await nextTick();
    expect(dayCell(ts(2026, 0, 5))?.classList.contains('sn-date-picker-cell--start')).toBe(true);
    expect(dayCell(ts(2026, 0, 10))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      false,
    );
    // light in-range background (the pointer cell itself is the cursor).
    dayCell(ts(2026, 0, 10))?.dispatchEvent(new Event('mouseenter'));
    await nextTick();
    expect(dayCell(ts(2026, 0, 7))?.classList.contains('sn-date-picker-cell--in-range')).toBe(true);
    // Hovering BEFORE the start flips the preview bounds (direction-agnostic).
    dayCell(ts(2026, 0, 2))?.dispatchEvent(new Event('mouseenter'));
    await nextTick();
    expect(dayCell(ts(2026, 0, 2))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      false,
    );
    expect(dayCell(ts(2026, 0, 4))?.classList.contains('sn-date-picker-cell--in-range')).toBe(true);
    // Committing (non-datetime) closes the panel and emits the full range;
    // the hovered preview never leaked into the emitted value.
    dayCell(ts(2026, 0, 12))?.click();
    await nextTick();
    expect(value.value).toEqual([ts(2026, 0, 5), ts(2026, 0, 12)]);
  });

  it('renders two time groups in datetimerange mode', async () => {
    const w = mountPicker({
      type: 'datetimerange',
      modelValue: [ts(2026, 0, 5, 9, 0, 0), ts(2026, 0, 20, 18, 0, 0)],
    });
    await openPanel(w);
    expect(document.body.querySelectorAll('.sn-date-picker-time-group')).toHaveLength(2);
    // First group hour 9 selected, second group hour 18 selected.
    expect(timeCell('hour', 9, 0)?.classList.contains('sn-date-picker-time-item--selected')).toBe(
      true,
    );
    expect(timeCell('hour', 18, 1)?.classList.contains('sn-date-picker-time-item--selected')).toBe(
      true,
    );
  });

  /* ───── keyboard ───── */

  it('opens with Enter and moves the cursor with ArrowRight', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await nextTick();
    expect(panelEl()).not.toBeNull();
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(2026, 0, 6)]);
  });

  it('moves the cursor a week with ArrowUp / ArrowDown', async () => {
    // Live v-model: reopening re-initializes the cursor from the bound
    // value, so the second leg must step from the first commit.
    const { wrapper, value } = mountVModel(ts(2026, 0, 5));
    const trigger = triggerOf(wrapper);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'ArrowUp' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe(ts(2025, 11, 29));
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe(ts(2026, 0, 5));
  });

  it('pages months with PageDown / PageUp', async () => {
    const { wrapper, value } = mountVModel(ts(2026, 0, 5));
    const trigger = triggerOf(wrapper);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'PageDown' });
    expect(document.body.querySelector('.sn-date-picker-calendar__title')?.textContent).toBe(
      '2026年2月',
    );
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(value.value).toBe(ts(2026, 1, 5));
    await trigger.trigger('keydown', { key: 'PageUp' });
    expect(document.body.querySelector('.sn-date-picker-calendar__title')?.textContent).toBe(
      '2026年1月',
    );
  });

  it('Enter commits the datetime draft and closes', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5, 8, 0, 0), type: 'datetime' });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await trigger.trigger('keydown', { key: 'Enter' });
    // Enter confirms what the panel highlights — the cursor day — combined
    // with the pending time-of-day.
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([ts(2026, 0, 6, 8, 0, 0)]);
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('Escape closes without committing', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    await trigger.trigger('keydown', { key: 'ArrowRight' });
    await trigger.trigger('keydown', { key: 'Escape' });
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
    expect(w.emitted('update:modelValue')).toBeUndefined();
  });

  it('tracks the cursor via aria-activedescendant', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5) });
    const trigger = triggerOf(w);
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(trigger.attributes('aria-activedescendant')).toContain(String(ts(2026, 0, 5)));
    await trigger.trigger('keydown', { key: 'ArrowLeft' });
    expect(trigger.attributes('aria-activedescendant')).toContain(String(ts(2026, 0, 4)));
  });

  /* ───── clearable ───── */

  it('clears the value via the clear button and emits clear', async () => {
    const w = mountPicker({ modelValue: ts(2026, 0, 5), clearable: true });
    await w.find('.sn-date-picker__clear').trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    expect(w.emitted('change')?.at(-1)).toEqual([null]);
    expect(w.emitted('clear')).toHaveLength(1);
  });

  it('clears a range value via the clear button', async () => {
    const w = mountPicker({
      type: 'daterange',
      modelValue: [ts(2026, 0, 5), ts(2026, 0, 20)],
      clearable: true,
    });
    await w.find('.sn-date-picker__clear').trigger('click');
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([null]);
  });

  it('hides the clear button when empty or disabled', () => {
    expect(mountPicker({ clearable: true }).find('.sn-date-picker__clear').exists()).toBe(false);
    expect(
      mountPicker({ modelValue: ts(2026, 0, 5), clearable: true, disabled: true })
        .find('.sn-date-picker__clear')
        .exists(),
    ).toBe(false);
  });

  /* ───── disabled / readonly ───── */

  it('does not open when disabled', async () => {
    const w = mountPicker({ disabled: true });
    await triggerOf(w).trigger('click');
    expect(panelEl()).toBeNull();
    expect(w.find('.sn-date-picker--disabled').exists()).toBe(true);
    await triggerOf(w).trigger('keydown', { key: 'Enter' });
    expect(panelEl()).toBeNull();
  });

  it('does not open when readonly', async () => {
    const w = mountPicker({ readonly: true });
    await triggerOf(w).trigger('click');
    expect(panelEl()).toBeNull();
  });

  /* ───── open/close behavior ───── */

  it('toggles the panel on repeated trigger clicks', async () => {
    const w = mountPicker();
    const trigger = triggerOf(w);
    await trigger.trigger('click');
    await nextTick();
    expect(panelEl()).not.toBeNull();
    await trigger.trigger('click');
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('closes on outside click', async () => {
    const w = mountPicker();
    await openPanel(w);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('stays open when clicking inside the panel', async () => {
    const w = mountPicker();
    await openPanel(w);
    panelEl()?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(panelEl()).not.toBeNull();
  });

  it('removes the document listener on unmount (no leak)', async () => {
    const w = mountPicker();
    await openPanel(w);
    const spy = vi.spyOn(document, 'removeEventListener');
    w.unmount();
    expect(spy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    spy.mockRestore();
  });

  /* ───── events / misc ───── */

  it('emits focus and blur from the trigger', async () => {
    const w = mountPicker();
    await triggerOf(w).trigger('focus');
    await triggerOf(w).trigger('blur');
    expect(w.emitted('focus')).toHaveLength(1);
    expect(w.emitted('blur')).toHaveLength(1);
  });

  it('applies size and status classes', () => {
    expect(mountPicker({ size: 'large' }).classes()).toContain('sn-date-picker--large');
    expect(mountPicker({ status: 'error' }).classes()).toContain('sn-date-picker--status-error');
  });

  it('accepts a placeholder pair in range mode', () => {
    const w = mountPicker({
      type: 'daterange',
      placeholder: ['从', '到'],
    });
    const ph = w.findAll('.sn-date-picker__placeholder');
    expect(ph[0]?.text()).toBe('从');
    expect(ph[1]?.text()).toBe('到');
  });

  it('isSameDay helper ignores time-of-day', () => {
    expect(isSameDay(ts(2026, 0, 5, 23, 59), ts(2026, 0, 5, 0, 0))).toBe(true);
    expect(isSameDay(ts(2026, 0, 5), ts(2026, 0, 6))).toBe(false);
  });

  it('opens the panel through the sn-pop transition and settles with it mounted', async () => {
    // VTU stubs Transition by default; opt into the real one here so the
    // sn-pop enter classes are actually applied.
    const w = mount(SnDatePicker, {
      props: {},
      attachTo: document.body,
      global: { stubs: { transition: false } },
    });
    mounted.push(w);
    await openPanel(w);
    const panel = panelEl() as HTMLElement;
    // Enter classes prove the Transition name is sn-pop (applied synchronously).
    expect(panel).not.toBeNull();
    expect(
      panel.classList.contains('sn-pop-enter-from') ||
        panel.classList.contains('sn-pop-enter-active'),
    ).toBe(true);
    // Enter completes within 300ms: panel still mounted, enter classes gone.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const settled = panelEl() as HTMLElement | null;
    expect(settled).not.toBeNull();
    expect(settled.classList.contains('sn-pop-enter-active')).toBe(false);
    expect(settled.classList.contains('sn-pop-enter-from')).toBe(false);
  });

  /* ───── scroll follow (useOverlayFollow) ───── */

  /** rAF stub that runs the queued frame synchronously. */
  function stubSyncFrame(): void {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  }

  const TRIGGER_RECT = (left: number) => ({
    top: 300,
    left,
    width: 240,
    height: 32,
    right: left + 240,
    bottom: 332,
    x: left,
    y: 300,
    toJSON: () => ({}),
  });
  const PANEL_RECT = {
    top: 0,
    left: 0,
    width: 280,
    height: 260,
    right: 280,
    bottom: 260,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  };

  it('keeps the panel glued to the trigger when the page scrolls while open', async () => {
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    const panel = panelEl() as HTMLElement;
    expect(panel.style.left).toBe('40px');
    // The page scrolled: the trigger's viewport rect moved 80px right.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('sn-date-picker-panel') ? PANEL_RECT : TRIGGER_RECT(120);
    });
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(panel.style.left).toBe('120px');
    vi.unstubAllGlobals();
  });

  it('stops following page scroll once the panel closes', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    await triggerOf(w).trigger('click');
    await nextTick();
    expect(removeSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      expect.objectContaining({ capture: true }),
    );
  });

  it('stops following page scroll after unmount', async () => {
    const w = mountPicker();
    await openPanel(w);
    await nextTick();
    w.unmount();
    mounted.splice(mounted.indexOf(w), 1);
    const reads = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
    stubSyncFrame();
    window.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(reads).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

/* ───── week / quarter / shortcuts / disabledDate / select ───── */

describe('SnDatePicker extended modes', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      const isPanel = this.classList.contains('sn-date-picker-panel');
      return isPanel
        ? {
            top: 0,
            left: 0,
            width: 300,
            height: 300,
            right: 300,
            bottom: 300,
            x: 0,
            y: 0,
            toJSON: () => ({}),
          }
        : {
            top: 300,
            left: 40,
            width: 200,
            height: 32,
            right: 240,
            bottom: 332,
            x: 40,
            y: 300,
            toJSON: () => ({}),
          };
    });
  });

  afterEach(async () => {
    for (const w of mounted.splice(0)) w.unmount();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('week type: clicking a day commits its week Monday and closes', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'week' });
    await openPanel(wrapper);
    // 2026-10-14 is a Wednesday → its week Monday is 2026-10-12.
    dayCell(ts(2026, 9, 14))?.click();
    await nextTick();
    expect(value.value).toBe(ts(2026, 9, 12));
    await panelLeft();
    expect(panelEl()).toBeNull();
    expect(wrapper.find('.sn-date-picker__value').text()).toBe('2026-42周');
  });

  it('week type: the whole selected week is highlighted on reopen', async () => {
    const w = mountPicker({ type: 'week', modelValue: ts(2026, 9, 12) });
    await openPanel(w);
    expect(dayCell(ts(2026, 9, 12))?.classList.contains('sn-date-picker-cell--selected')).toBe(
      true,
    );
    expect(dayCell(ts(2026, 9, 18))?.classList.contains('sn-date-picker-cell--selected')).toBe(
      true,
    );
    expect(dayCell(ts(2026, 9, 19))?.classList.contains('sn-date-picker-cell--selected')).toBe(
      false,
    );
  });

  it('quarter type: commits the quarter start and echoes yyyy-Qq', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'quarter' });
    await openPanel(wrapper);
    const q4 = panelEl()?.querySelector('.sn-date-picker-cell--unit[data-value="3"]');
    q4?.click();
    await nextTick();
    expect(value.value).toBe(ts(2026, 9, 1));
    await panelLeft();
    expect(wrapper.find('.sn-date-picker__value').text()).toBe('2026-Q4');
  });

  it('weekrange: two picks commit sorted week Mondays', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'weekrange' });
    await openPanel(wrapper);
    dayCell(ts(2026, 9, 14))?.click(); // week of Oct 12
    await nextTick();
    dayCell(ts(2026, 9, 27))?.click(); // week of Oct 26
    await nextTick();
    expect(value.value).toEqual([ts(2026, 9, 12), ts(2026, 9, 26)]);
    // The panel closes after the second pick; reopening highlights whole weeks.
    await panelLeft();
    await openPanel(wrapper);
    // Whole start/end weeks carry the markers (isSameWeek across the row).
    expect(dayCell(ts(2026, 9, 12))?.classList.contains('sn-date-picker-cell--start')).toBe(true);
    expect(dayCell(ts(2026, 9, 18))?.classList.contains('sn-date-picker-cell--start')).toBe(true);
    expect(dayCell(ts(2026, 9, 26))?.classList.contains('sn-date-picker-cell--end')).toBe(true);
    expect(dayCell(ts(2026, 10, 1))?.classList.contains('sn-date-picker-cell--end')).toBe(true);
    // The in-between week lights up; the week before the range stays plain.
    expect(dayCell(ts(2026, 9, 20))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      true,
    );
    expect(dayCell(ts(2026, 9, 5))?.classList.contains('sn-date-picker-cell--in-range')).toBe(
      false,
    );
  });

  it('quarterrange: two picks commit sorted quarter starts', async () => {
    const { wrapper, value } = mountVModel(null, { type: 'quarterrange' });
    await openPanel(wrapper);
    // First calendar shows 2026 quarters; second shows 2027.
    const first = panelEl()?.querySelectorAll('.sn-date-picker-calendar')[0];
    first?.querySelector('.sn-date-picker-cell--unit[data-value="1"]')?.click(); // 2026 Q2
    await nextTick();
    const second = panelEl()?.querySelectorAll('.sn-date-picker-calendar')[1];
    second?.querySelector('.sn-date-picker-cell--unit[data-value="0"]')?.click(); // 2027 Q1
    await nextTick();
    expect(value.value).toEqual([ts(2026, 3, 1), ts(2027, 0, 1)]);
  });

  it('disabledDate: blocked day cells refuse clicks and carry aria-disabled', async () => {
    const disabled = (t: number): boolean => t === ts(2026, 9, 15);
    const { value } = mountVModel(null, { disabledDate: disabled });
    await openPanel(findLastWrapper());
    const cell = dayCell(ts(2026, 9, 15));
    expect(cell?.classList.contains('sn-date-picker-cell--disabled')).toBe(true);
    expect(cell?.getAttribute('aria-disabled')).toBe('true');
    cell?.click();
    await nextTick();
    expect(value.value).toBeNull();
  });

  it('select event fires on each pick with the draft value', async () => {
    const w = mountPicker({ type: 'daterange' });
    await openPanel(w);
    dayCell(ts(2026, 9, 10))?.click();
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual([ts(2026, 9, 10)]);
    dayCell(ts(2026, 9, 20))?.click();
    await nextTick();
    expect(w.emitted('select')?.at(-1)).toEqual([[ts(2026, 9, 10), ts(2026, 9, 20)]]);
  });

  it('shortcuts: clicking a lazy entry commits and closes', async () => {
    const target = ts(2026, 5, 1);
    const w = mountPicker({
      shortcuts: [{ label: 'June', value: () => target }],
      shortcutsPosition: 'bottom',
    });
    await openPanel(w);
    const btn = panelEl()?.querySelector('.sn-date-picker-panel__shortcut');
    expect(btn?.textContent?.trim()).toBe('June');
    btn?.click();
    await nextTick();
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual([target]);
    await panelLeft();
    expect(panelEl()).toBeNull();
  });

  it('shortcutsPosition: left/right render a side column, bottom a bar', async () => {
    const shortcuts = [{ label: 'today', value: 0 }];
    const left = mountPicker({ shortcuts, shortcutsPosition: 'left' });
    await openPanel(left);
    expect(panelEl()?.querySelector('.sn-date-picker-panel__shortcuts--side')).not.toBeNull();

    // Unmount the first instance so only the bottom panel is in the body.
    left.unmount();
    mounted.splice(mounted.indexOf(left), 1);

    const bottom = mountPicker({ shortcuts, shortcutsPosition: 'bottom' });
    await openPanel(bottom);
    expect(panelEl()?.querySelector('.sn-date-picker-panel__shortcuts--bottom')).not.toBeNull();
    expect(panelEl()?.querySelector('.sn-date-picker-panel__shortcuts--side')).toBeNull();
  });

  it('datetime panel: time columns sit beside the calendar (aside layout)', async () => {
    const w = mountPicker({ type: 'datetime' });
    await openPanel(w);
    const aside = panelEl()?.querySelector('.sn-date-picker-panel__time--aside');
    expect(aside).not.toBeNull();
    // Header 选择时间 only in single mode; columns live in the aside group.
    expect(aside?.querySelector('.sn-date-picker-time-group__label')?.textContent).toBe('选择时间');
    expect(aside?.querySelectorAll('.sn-date-picker-time-col').length).toBe(3);
  });

  it('datetimerange panel: one aside time group per calendar', async () => {
    const w = mountPicker({ type: 'datetimerange' });
    await openPanel(w);
    expect(panelEl()?.querySelectorAll('.sn-date-picker-panel__time--aside')).toHaveLength(2);
    // No visible per-side labels in range mode (aria only).
    expect(
      panelEl()?.querySelector(
        '.sn-date-picker-panel__time--aside .sn-date-picker-time-group__label',
      ),
    ).toBeNull();
  });

  it('date type shows the 今天 footer jump that commits today', async () => {
    const w = mountPicker({ type: 'date' });
    await openPanel(w);
    const today = panelEl()?.querySelector('.sn-date-picker-panel__today');
    expect(today?.textContent?.trim()).toBe('今天');
    today?.click();
    await nextTick();
    const committed = w.emitted('update:modelValue')?.at(-1)?.[0];
    expect(typeof committed).toBe('number');
    expect(isSameDay(committed as number, Date.now())).toBe(true);
  });
});

/** The most recently mounted wrapper's root component (test helper). */
function findLastWrapper() {
  const last = mounted.at(-1);
  if (!last) throw new Error('nothing mounted');
  type Findable = {
    findComponent: (c: unknown) => {
      find: (s: string) => { trigger: (e: string, o?: unknown) => Promise<void> };
    };
  };
  return (last as unknown as Findable).findComponent(SnDatePicker);
}
