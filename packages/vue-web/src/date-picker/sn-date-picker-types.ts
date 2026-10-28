/**
 * SnDatePicker shared types + pure date helpers — internal to
 * `src/date-picker/`.
 *
 * The public value contract is a millisecond timestamp (number) for single
 * modes and a `[start, end]` tuple for range modes, interpreted in the
 * host's local timezone (Date#getFullYear/setHours — the same convention
 * the reference library naive-ui uses).
 *
 * Date arithmetic is implemented natively (no dayjs — package rule); all
 * helpers are pure and exported so tests can exercise them directly
 * (AGENTS.md §43/§46). Kept in a plain `.ts` module (same convention as
 * sn-time-picker-types.ts) so no shared wiring is touched.
 */

/** Panel / value mode. `*range` types are range modes (tuple values). */
export type SnDatePickerType =
  | 'date'
  | 'datetime'
  | 'week'
  | 'quarter'
  | 'month'
  | 'year'
  | 'daterange'
  | 'datetimerange'
  | 'weekrange'
  | 'quarterrange';

/** Visual size preset (AUI convention adds `mini` below the reference `tiny`). */
export type SnDatePickerSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Validation-driven visual status. */
export type SnDatePickerStatus = 'default' | 'error' | 'warning';

/** Single-mode value: millisecond timestamp or null. */
export type SnDateValue = number | null;

/** Range-mode value: [start, end] timestamps or null. */
export type SnDateRangeValue = readonly [number, number] | null;

/** Calendar date parts (local timezone). `month` is 0-based like Date. */
export interface SnDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

/** One cell of a month grid (role=gridcell). */
export interface SnMonthGridCell {
  /** Local-midnight timestamp of the cell's date. */
  ts: number;
  /** Day-of-month label (1–31). */
  day: number;
  /** Whether the cell belongs to the grid's anchor month. */
  isCurrentMonth: boolean;
}

/** One cell of a quarter / month-of-year / year grid. */
export interface SnUnitGridCell {
  ts: number;
  /** Cell label ('Q1' / '1月' / '2026'). */
  label: string;
  /** Unit value (quarter index 0–3, month index 0–11, or the year). */
  value: number;
}

/** Quick-pick shortcut entry (`value` may be lazy — resolved on click). */
export interface SnDatePickerShortcut {
  label: string;
  value: number | [number, number] | (() => number | [number, number]);
}

/** Where the shortcuts bar renders inside the panel. */
export type SnDatePickerShortcutsPosition = 'left' | 'right' | 'bottom';

/** Default display format per type. */
export const DEFAULT_FORMATS: Readonly<Record<SnDatePickerType, string>> = {
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  week: 'yyyy-ww周',
  quarter: 'yyyy-Qq',
  month: 'yyyy-MM',
  year: 'yyyy',
  daterange: 'yyyy-MM-dd',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  weekrange: 'yyyy-ww周',
  quarterrange: 'yyyy-Qq',
};

/** Weekday header labels — Monday-first grid (project convention). */
export const WEEKDAY_LABELS: readonly string[] = ['一', '二', '三', '四', '五', '六', '日'];

/** Month-of-year labels (1月 … 12月). */
export const MONTH_LABELS: readonly string[] = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

/** Two-digit zero padding ('05'). */
export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Inclusive integer range [min, max]. */
export function rangeInclusive(min: number, max: number): number[] {
  const out: number[] = [];
  for (let v = min; v <= max; v += 1) out.push(v);
  return out;
}

/** Split a millisecond timestamp into local date parts. */
export function getDateParts(ms: number): SnDateParts {
  const d = new Date(ms);
  return {
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
  };
}

/** Build a local timestamp from date parts (out-of-range values clamp via Date). */
export function buildDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): number {
  return new Date(year, month, day, hour, minute, second, 0).getTime();
}

/** Local-midnight timestamp of the given timestamp's date. */
export function startOfDay(ms: number): number {
  const p = getDateParts(ms);
  return buildDate(p.year, p.month, p.day);
}

/** Local midnight of the Monday starting the given timestamp's ISO week. */
export function startOfWeek(ms: number): number {
  const p = getDateParts(ms);
  const leading = (new Date(p.year, p.month, p.day).getDay() + 6) % 7; // Mon → 0
  return buildDate(p.year, p.month, p.day - leading);
}

/** First day (local midnight) of the given timestamp's month. */
export function startOfMonth(ms: number): number {
  const p = getDateParts(ms);
  return buildDate(p.year, p.month, 1);
}

/** First day (local midnight) of the given timestamp's quarter. */
export function startOfQuarter(ms: number): number {
  const p = getDateParts(ms);
  return buildDate(p.year, Math.floor(p.month / 3) * 3, 1);
}

/** Quarter index 1–4 of the given timestamp. */
export function getQuarter(ms: number): number {
  return Math.floor(getDateParts(ms).month / 3) + 1;
}

/** First day of the given timestamp's year. */
export function startOfYear(ms: number): number {
  const p = getDateParts(ms);
  return buildDate(p.year, 0, 1);
}

/**
 * ISO 8601 week number of the given timestamp (weeks start Monday; week 1
 * contains the first Thursday). Returns the ISO week-year alongside —
 * boundary days of December / January may belong to the adjacent year.
 */
export function getIsoWeek(ms: number): { isoYear: number; week: number } {
  const p = getDateParts(ms);
  const dayOffset = (new Date(p.year, p.month, p.day).getDay() + 6) % 7; // Mon → 0
  // The Thursday of this week pins the ISO year.
  const thursday = buildDate(p.year, p.month, p.day - dayOffset + 3);
  const t = getDateParts(thursday);
  const week1Monday = buildDate(t.year, 0, 4 - ((new Date(t.year, 0, 4).getDay() + 6) % 7));
  const week = Math.round((thursday - week1Monday) / 86_400_000 / 7) + 1;
  return { isoYear: t.year, week };
}

/** Shift a timestamp by whole months, keeping the day-of-month clamped. */
export function addMonths(ms: number, delta: number): number {
  const p = getDateParts(ms);
  const target = new Date(p.year, p.month + delta, 1, p.hour, p.minute, p.second, 0);
  // Clamp e.g. Jan 31 + 1 month → Feb 28/29 (Date's own overflow behavior).
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return buildDate(
    target.getFullYear(),
    target.getMonth(),
    Math.min(p.day, lastDay),
    p.hour,
    p.minute,
    p.second,
  );
}

/** Shift a timestamp by whole years. */
export function addYears(ms: number, delta: number): number {
  return addMonths(ms, delta * 12);
}

/** Shift a timestamp by whole days, preserving the time-of-day. */
export function addDays(ms: number, delta: number): number {
  const p = getDateParts(ms);
  return buildDate(p.year, p.month, p.day + delta, p.hour, p.minute, p.second);
}

/** Same local date (ignores time-of-day)? */
export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}

/** Same local ISO week (both dates' Mondays match)? */
export function isSameWeek(a: number, b: number): boolean {
  return startOfWeek(a) === startOfWeek(b);
}

/** Same local month? */
export function isSameMonth(a: number, b: number): boolean {
  const pa = getDateParts(a);
  const pb = getDateParts(b);
  return pa.year === pb.year && pa.month === pb.month;
}

/** Same local quarter? */
export function isSameQuarter(a: number, b: number): boolean {
  const pa = getDateParts(a);
  const pb = getDateParts(b);
  return pa.year === pb.year && Math.floor(pa.month / 3) === Math.floor(pb.month / 3);
}

/** Same local year? */
export function isSameYear(a: number, b: number): boolean {
  return getDateParts(a).year === getDateParts(b).year;
}

/** First year of the 12-year window the anchor year belongs to. */
export function decadeStart(year: number): number {
  return Math.floor(year / 10) * 10 - 1;
}

/**
 * Month grid for an anchor (year, monthIdx): 6 rows × 7 columns,
 * Monday-first. Leading/trailing cells belong to adjacent months.
 */
export function buildMonthGrid(year: number, monthIdx: number): SnMonthGridCell[][] {
  const first = new Date(year, monthIdx, 1);
  const leading = (first.getDay() + 6) % 7; // Monday → 0
  const gridStart = addDays(buildDate(year, monthIdx, 1), -leading);
  const rows: SnMonthGridCell[][] = [];
  let cursor = gridStart;
  for (let r = 0; r < 6; r += 1) {
    const row: SnMonthGridCell[] = [];
    for (let c = 0; c < 7; c += 1) {
      const p = getDateParts(cursor);
      row.push({
        ts: cursor,
        day: p.day,
        isCurrentMonth: p.month === monthIdx && p.year === year,
      });
      cursor = addDays(cursor, 1);
    }
    rows.push(row);
  }
  return rows;
}

/** Quarter grid (4 cells) for an anchor year. */
export function buildQuarterUnitGrid(
  year: number,
  quarterLabel: (q: number) => string,
): SnUnitGridCell[] {
  return rangeInclusive(0, 3).map((q) => ({
    ts: buildDate(year, q * 3, 1),
    label: quarterLabel(q + 1),
    value: q,
  }));
}

/** Month-of-year grid (12 cells) for an anchor year. */
export function buildMonthUnitGrid(year: number): SnUnitGridCell[] {
  return rangeInclusive(0, 11).map((m) => ({
    ts: buildDate(year, m, 1),
    label: MONTH_LABELS[m] ?? '',
    value: m,
  }));
}

/** Year grid: 12 cells covering the anchor's decade window. */
export function buildYearUnitGrid(anchorYear: number): SnUnitGridCell[] {
  const start = decadeStart(anchorYear);
  return rangeInclusive(start, start + 11).map((y) => ({
    ts: buildDate(y, 0, 1),
    label: String(y),
    value: y,
  }));
}

/** Panel header title for the anchor month ('2026年1月'). */
export function formatMonthTitle(year: number, monthIdx: number): string {
  return `${year}年${monthIdx + 1}月`;
}

/** Panel header title for a year anchor ('2026年'). */
export function formatYearTitle(year: number): string {
  return `${year}年`;
}

/** Panel header title for a year window ('2020 - 2031'). */
export function formatDecadeTitle(anchorYear: number): string {
  const start = decadeStart(anchorYear);
  return `${start} - ${start + 11}`;
}

/**
 * Format a timestamp with the supported token set (lowercase):
 * `yyyy` `yy` `MM` `M` `dd` `d` `HH` `H` `mm` `m` `ss` `s` `ww` `w` `qq` `q`.
 * `w`/`ww` resolve to the ISO week number and `q`/`qq` to the quarter;
 * `yyyy` stays the CALENDAR year (week formats at Dec/Jan boundaries may
 * diverge from the ISO week-year — documented in ai-description.md).
 * Uppercase variants (YYYY-MM-DD) are NOT supported.
 */
export function formatDate(ms: number, format: string): string {
  const p = getDateParts(ms);
  const iso = getIsoWeek(ms);
  const quarter = getQuarter(ms);
  const tokens: Record<string, string> = {
    yyyy: String(p.year),
    yy: pad2(p.year % 100),
    MM: pad2(p.month + 1),
    M: String(p.month + 1),
    dd: pad2(p.day),
    d: String(p.day),
    HH: pad2(p.hour),
    H: String(p.hour),
    mm: pad2(p.minute),
    m: String(p.minute),
    ss: pad2(p.second),
    s: String(p.second),
    ww: pad2(iso.week),
    w: String(iso.week),
    qq: `Q${quarter}`,
    q: String(quarter),
  };
  return format.replace(/yyyy|yy|ww|MM|qq|dd|HH|mm|ss|M|d|H|m|s|w|q/g, (t) => tokens[t] ?? t);
}

/** Combine a date (day precision) with a time-of-day. */
export function combineDateTime(
  dayMs: number,
  hour: number,
  minute: number,
  second: number,
): number {
  const p = getDateParts(dayMs);
  return buildDate(p.year, p.month, p.day, hour, minute, second);
}

/** Whether a type is a range mode. */
export function isRangeType(type: SnDatePickerType): boolean {
  return (
    type === 'daterange' ||
    type === 'datetimerange' ||
    type === 'weekrange' ||
    type === 'quarterrange'
  );
}

/** Whether a type carries a time-of-day column. */
export function hasTimePart(type: SnDatePickerType): boolean {
  return type === 'datetime' || type === 'datetimerange';
}

/** Whether a type picks whole ISO weeks (row selection). */
export function isWeekType(type: SnDatePickerType): boolean {
  return type === 'week' || type === 'weekrange';
}

/** Whether a type picks quarters (Q1–Q4 grid). */
export function isQuarterType(type: SnDatePickerType): boolean {
  return type === 'quarter' || type === 'quarterrange';
}
