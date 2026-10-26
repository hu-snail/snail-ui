/**
 * Date-grid utilities for SnCalendar (AUI-WEB-DD-001) — internal to
 * `src/calendar/`.
 *
 * Per the component task brief the date math is self-contained: native
 * `Date` arithmetic only (no dayjs / date-fns), and no imports from
 * `src/date-picker` internals or any shared `_internal` module.
 *
 * `buildCalendarCells` mirrors naive-ui `date-picker/src/utils.ts`
 * `dateArray()` with `strip = true` (the exact call n-calendar makes), so
 * the grid has 28 / 35 / 42 cells depending on how the month falls in the
 * week grid. All day arithmetic is noon-anchored to stay stable across DST
 * shifts; cell timestamps are local midnight (what n-calendar emits).
 */

/** A day cell in the calendar grid. Mirrors naive-ui `DateItem` (date mode). */
export interface SnCalendarCell {
  /** Timestamp of the day at local midnight — the value n-calendar emits. */
  ts: number;
  /** Full year. */
  year: number;
  /** 1-based month (the convention n-calendar exposes to slots / events). */
  month: number;
  /** Day of month (1-based). */
  date: number;
  /** `yyyy-MM-dd` (local calendar), used for the cell `title` attributes. */
  iso: string;
  /** Whether the cell belongs to the displayed month. */
  inCurrentMonth: boolean;
  /** Whether the cell is "today" (same local day as `currentTs`). */
  isCurrentDate: boolean;
  /** Whether the cell matches the selected value (time-of-day ignored). */
  selected: boolean;
  /** Whether `isDateDisabled` rejects this day. */
  disabled: boolean;
  /** zh-CN weekday label ('周一'…'周日'), shown in the first grid row. */
  weekdayLabel: string;
}

/** `{ year, month }` panel info; `month` is 1-based (n-calendar event shape). */
export interface SnCalendarPanelInfo {
  year: number;
  month: number;
}

/** `{ year, month, date }` with a 1-based month (n-calendar event shape). */
export interface SnCalendarDateItem {
  year: number;
  month: number;
  date: number;
}

/** zh-CN weekday labels, Monday-first index (matches naive 'EEE' zh output). */
export const WEEKDAY_SHORT_LABELS: readonly string[] = [
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
] as const;

function getParts(ms: number): { year: number; month0: number; date: number } {
  const d = new Date(ms);
  return { year: d.getFullYear(), month0: d.getMonth(), date: d.getDate() };
}

/** Day-of-week: 0 = Sunday … 6 = Saturday (Date#getDay convention). */
export function weekdayIndexOf(ms: number): number {
  return (new Date(ms).getDay() + 6) % 7;
}

/** Local midnight of the day containing `ms`. */
export function startOfDay(ms: number): number {
  const { year, month0, date } = getParts(ms);
  return new Date(year, month0, date).getTime();
}

/** Local midnight of the first day of the month containing `ms`. */
export function startOfMonth(ms: number): number {
  const { year, month0 } = getParts(ms);
  return new Date(year, month0, 1).getTime();
}

/** Number of days in a month (`month0` is 0-based). */
export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}

/** Add `delta` days at local-midnight precision (crosses months / years). */
export function addDays(ms: number, delta: number): number {
  const { year, month0, date } = getParts(ms);
  return new Date(year, month0, date + delta).getTime();
}

/**
 * Add `amount` months, clamping the day-of-month like date-fns `addMonths`
 * (e.g. Jan 31 + 1 month → Feb 28; onto Feb 29 in leap years).
 * Time-of-day is preserved.
 */
export function addMonths(ms: number, amount: number): number {
  const d = new Date(ms);
  const total = d.getFullYear() * 12 + d.getMonth() + amount;
  const year = Math.floor(total / 12);
  const month0 = total - year * 12;
  const date = Math.min(d.getDate(), daysInMonth(year, month0));
  return new Date(
    year,
    month0,
    date,
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  ).getTime();
}

/** Stable per-day key, immune to time-of-day differences. */
function dayKey(ms: number): string {
  const { year, month0, date } = getParts(ms);
  return `${year}-${month0}-${date}`;
}

/** Whether two timestamps fall on the same local calendar day. */
function isSameDay(a: number, b: number): boolean {
  return dayKey(a) === dayKey(b);
}

/** `yyyy-MM-dd` with zero-padded month and day. */
export function formatIsoDate(ms: number): string {
  const { year, month0, date } = getParts(ms);
  const mm = String(month0 + 1).padStart(2, '0');
  const dd = String(date).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/** 1-based `{ year, month }` of the month containing `ms`. */
export function panelInfoOf(ms: number): SnCalendarPanelInfo {
  const { year, month0 } = getParts(ms);
  return { year, month: month0 + 1 };
}

/**
 * Build the month grid for n-calendar parity.
 *
 * Mirrors naive-ui `dateArray(monthTs, valueTs, currentTs, firstDayOfWeek, strip = true)`:
 *   1. Walk back from the last day of the previous month until the
 *      week-start weekday (Monday) is reached — leading previous-month cells.
 *   2. Push every day of the displayed month.
 *   3. Pad with next-month days to 28 / 35 / 42 cells, whichever fits.
 */
export function buildCalendarCells(
  monthTs: number,
  valueTs: number | null,
  currentTs: number,
  isDateDisabled?: (ts: number) => boolean | undefined,
): SnCalendarCell[] {
  const displayMonth0 = getParts(monthTs).month0;
  const cells: SnCalendarCell[] = [];

  const makeCell = (ms: number): SnCalendarCell => {
    const { year, month0, date } = getParts(ms);
    const ts = startOfDay(ms);
    return {
      ts,
      year,
      month: month0 + 1,
      date,
      iso: formatIsoDate(ms),
      inCurrentMonth: month0 === displayMonth0,
      isCurrentDate: isSameDay(ms, currentTs),
      selected: valueTs !== null && isSameDay(ms, valueTs),
      disabled: isDateDisabled?.(ts) === true,
      weekdayLabel: WEEKDAY_SHORT_LABELS[weekdayIndexOf(ms)] ?? '',
    };
  };

  // Leading cells: back-fill from the last day of the previous month, stopping
  // once the previous Sunday is reached (exclusive). This mirrors naive
  // `dateArray`'s `while (getDay(iterator) !== startDay)` loop: the zh-CN
  // locale startDay (0) is compared against date-fns getDay (0 = Sunday), so
  // the walk keeps Monday..Saturday and the first grid column is Monday.
  let iterator = addDays(startOfMonth(monthTs), -1);
  while (weekdayIndexOf(iterator) !== 6) {
    cells.unshift(makeCell(iterator));
    iterator = addDays(iterator, -1);
  }

  // Displayed month.
  iterator = startOfMonth(monthTs);
  while (getParts(iterator).month0 === displayMonth0) {
    cells.push(makeCell(iterator));
    iterator = addDays(iterator, 1);
  }

  // Trailing pad to a full week grid (naive strip=true: 28 / 35 / 42).
  const endIndex = cells.length <= 28 ? 28 : cells.length <= 35 ? 35 : 42;
  while (cells.length < endIndex) {
    cells.push(makeCell(iterator));
    iterator = addDays(iterator, 1);
  }

  return cells;
}
