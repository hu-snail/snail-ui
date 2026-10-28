/**
 * SnHeatmap pure matrix helpers — internal to `src/heatmap/`.
 *
 * Mirrors the reference data pipeline (naive-ui
 * `src/heatmap/src/utils/index.ts` + `Heatmap.tsx`): sort → week-aligned
 * gap fill → 7-row matrix (row = weekday, column = week) → color level
 * bucketing. `firstDayOfWeek` follows the reference convention where
 * `0 = Monday` (converted to the Sunday-first convention internally,
 * like the reference's `transformNaiveFirstDayOfWeekToDateFns`).
 *
 * All helpers are pure and date arithmetic is native (no dayjs /
 * date-fns — package rule). Self-contained by task boundary: no shared
 * `_internal` module is imported.
 */

/** One input datum. `value: null` (or absent) renders an empty cell. */
export interface SnHeatmapDataItem {
  /** Millisecond timestamp (any time-of-day; keyed by local date). */
  timestamp: number;
  /** Activity count; `0` renders the minimum color. */
  value?: number | null;
}

/** Week start, reference convention: `0 = Monday` … `6 = Sunday`. */
export type SnHeatmapFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Built-in color themes (mapped onto semantic token hues by the SFC). */
export type SnHeatmapColorTheme = 'green' | 'blue' | 'orange' | 'purple' | 'red';

/** One laid-out grid cell. */
export interface SnHeatmapCell {
  /** Timestamp carried through from the input item (gap cells: midnight). */
  timestamp: number;
  /** Raw activity count; `null` marks a filler cell, `undefined` keeps an input item without a value (renders the minimum color, like the reference). */
  value: number | null | undefined;
  /** Weekday row, 0 = first row (relative to firstDayOfWeek). */
  rowIndex: number;
  /** Week column index. */
  colIndex: number;
}

export type SnHeatmapMatrix = ReadonlyArray<ReadonlyArray<SnHeatmapCell | null>>;

export interface SnHeatmapWeekLabel {
  label: string;
  /** The reference shows every other week label (odd indexes). */
  visible: boolean;
}

export interface SnHeatmapMonthLabel {
  name: string;
  colSpan: number;
}

/** Single-char weekday labels, Monday-first (reference zh-CN `eeeeee`). */
export const WEEK_CHAR_LABELS: readonly string[] = ['一', '二', '三', '四', '五', '六', '日'];

/** Loading skeleton grid shape (7 × 53, the reference layout). */
export const LOADING_MATRIX_COLS = 53;

/** Static col spans of the loading month labels (reference constants). */
const LOADING_MONTH_COL_SPANS: readonly number[] = [5, 4, 5, 4, 5, 4, 5, 4, 4, 5, 4, 4];

interface DayParts {
  year: number;
  /** 0-based month. */
  month: number;
  date: number;
}

function getParts(ms: number): DayParts {
  const d = new Date(ms);
  return { year: d.getFullYear(), month: d.getMonth(), date: d.getDate() };
}

/** Local midnight of the given timestamp's date. */
export function startOfDay(ms: number): number {
  const p = getParts(ms);
  return new Date(p.year, p.month, p.date).getTime();
}

function addDays(ms: number, delta: number): number {
  const p = getParts(ms);
  return new Date(p.year, p.month, p.date + delta).getTime();
}

/** Day-of-week, 0 = Sunday (the reference's date-fns convention). */
function dayOfWeek(ms: number): number {
  return new Date(ms).getDay();
}

/**
 * DST-safe calendar-day number: projected onto the UTC axis so a plain
 * difference of two day numbers equals the count of calendar days.
 */
export function dayNumber(ms: number): number {
  const p = getParts(ms);
  return Math.floor(Date.UTC(p.year, p.month, p.date) / 86_400_000);
}

/** Sunday-first week start derived from the reference Monday-first value. */
export function toDateFnsWeekStart(firstDayOfWeek: SnHeatmapFirstDayOfWeek): number {
  return (firstDayOfWeek + 1) % 7;
}

/** Days to step back from `ms` to reach its week's first day. */
function weekStartOffset(ms: number, dateFnsWeekStart: number): number {
  return (dayOfWeek(ms) - dateFnsWeekStart + 7) % 7;
}

/**
 * Color level bucket (0 = minimum, `levelCount - 1` = maximum), mirroring
 * the reference `calcColorByValue`: values ≤ 0 / null / a zero max all map
 * to level 0; otherwise `ceil(ratio × (levelCount - 1))` clamped.
 */
export function calcLevel(
  value: number | null | undefined,
  maxValue: number,
  levelCount = 5,
): number {
  if (maxValue === 0 || value === null || value === undefined || value <= 0) {
    return 0;
  }
  const ratio = Math.min(value / maxValue, 1);
  const maxLevel = levelCount - 1;
  return Math.min(Math.ceil(ratio * maxLevel), maxLevel);
}

/**
 * Week-aligned gap fill, mirroring the reference `completeDataGaps`:
 * sorts the input, spans [week start of the first date, week end of the
 * last date], keeps original items, fills missing in-range days with
 * `value: 0` and out-of-range days with `null` (leading days become `0`
 * only when `fillCalendarLeading` is set).
 */
export function normalizeHeatmapData(
  data: readonly SnHeatmapDataItem[],
  firstDayOfWeek: SnHeatmapFirstDayOfWeek,
  fillCalendarLeading: boolean,
): SnHeatmapDataItem[] {
  if (data.length === 0) return [];
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const firstItem = sorted[0];
  const lastItem = sorted[sorted.length - 1];
  if (!firstItem || !lastItem) return [];
  const firstDate = startOfDay(firstItem.timestamp);
  const lastDate = startOfDay(lastItem.timestamp);
  const ws = toDateFnsWeekStart(firstDayOfWeek);
  const firstCalendarDate = addDays(firstDate, -weekStartOffset(firstDate, ws));
  const lastCalendarEndDate = addDays(lastDate, 6 - weekStartOffset(lastDate, ws));
  const dataMap = new Map<number, SnHeatmapDataItem>();
  for (const item of sorted) {
    dataMap.set(startOfDay(item.timestamp), item);
  }
  const leadingStart = fillCalendarLeading ? firstCalendarDate : firstDate;
  const out: SnHeatmapDataItem[] = [];
  for (let day = firstCalendarDate; day <= lastCalendarEndDate; day = addDays(day, 1)) {
    const hit = dataMap.get(day);
    if (hit !== undefined) {
      out.push(hit);
      continue;
    }
    const within = day >= leadingStart && day <= lastDate;
    out.push({ timestamp: day, value: within ? 0 : null });
  }
  return out;
}

/**
 * 7-row matrix (row = weekday relative to the week start, column =
 * calendar week). Cells missing from a row are `null`.
 */
export function buildHeatmapMatrix(
  data: readonly SnHeatmapDataItem[],
  firstDayOfWeek: SnHeatmapFirstDayOfWeek,
): (SnHeatmapCell | null)[][] {
  if (data.length === 0) return [];
  const ws = toDateFnsWeekStart(firstDayOfWeek);
  const sorted = [...data].sort((a, b) => a.timestamp - b.timestamp);
  const firstCellTs = sorted[0];
  if (!firstCellTs) return [];
  const gridStartDate = startOfDay(firstCellTs.timestamp);
  const gridStart = addDays(gridStartDate, -weekStartOffset(gridStartDate, ws));
  const gridDay = dayNumber(gridStart);
  const cells: SnHeatmapCell[] = sorted.map((item) => {
    const date = startOfDay(item.timestamp);
    return {
      timestamp: item.timestamp,
      value: item.value,
      rowIndex: (dayOfWeek(date) - ws + 7) % 7,
      colIndex: Math.floor((dayNumber(date) - gridDay) / 7),
    };
  });
  let colCount = 0;
  for (const cell of cells) {
    if (cell.colIndex + 1 > colCount) colCount = cell.colIndex + 1;
  }
  const rows: (SnHeatmapCell | null)[][] = Array.from({ length: 7 }, () =>
    Array.from({ length: colCount }, () => null),
  );
  for (const cell of cells) {
    const row = rows[cell.rowIndex];
    if (row) row[cell.colIndex] = cell;
  }
  return rows;
}

/**
 * 7 × 53 loading skeleton (all minimum-level cells), like the reference.
 * The reference derives skeleton cell weekdays from `firstDayOfWeek`; our
 * skeleton carries no weekday field, so the parameter exists for call-site
 * parity and is intentionally unused.
 */
export function buildLoadingMatrix(
  _firstDayOfWeek: SnHeatmapFirstDayOfWeek,
): (SnHeatmapCell | null)[][] {
  const now = Date.now();
  const rows: (SnHeatmapCell | null)[][] = [];
  for (let row = 0; row < 7; row += 1) {
    const line: (SnHeatmapCell | null)[] = [];
    for (let col = 0; col < LOADING_MATRIX_COLS; col += 1) {
      line.push({ timestamp: now, value: 0, rowIndex: row, colIndex: col });
    }
    rows.push(line);
  }
  return rows;
}

/**
 * Week labels: starts at `firstDayOfWeek`. All seven rows stay visible —
 * the reference rendering shows the full 一二三四五六日 column.
 */
export function buildWeekLabels(firstDayOfWeek: SnHeatmapFirstDayOfWeek): SnHeatmapWeekLabel[] {
  return Array.from({ length: 7 }, (_, i) => ({
    label: WEEK_CHAR_LABELS[(firstDayOfWeek + i) % 7] ?? '',
    visible: true,
  }));
}

function monthKey(ms: number): string {
  const p = getParts(ms);
  return `${p.year}-${String(p.month + 1).padStart(2, '0')}`;
}

/**
 * Month header labels, mirroring the reference: each column takes the
 * month of its first non-null cell; months covering fewer than 3 whole
 * weeks are dropped; `colSpan` = covered week count.
 */
export function buildMonthLabels(matrix: SnHeatmapMatrix): SnHeatmapMonthLabel[] {
  const firstRow = matrix[0];
  if (!firstRow) return [];
  const colCount = firstRow.length;
  const stats = new Map<string, { start: number; end: number; weeks: number }>();
  for (let col = 0; col < colCount; col += 1) {
    let key: string | null = null;
    for (let row = 0; row < matrix.length; row += 1) {
      const cell = matrix[row]?.[col];
      if (cell !== null && cell !== undefined && cell.value !== null) {
        key = monthKey(cell.timestamp);
        break;
      }
    }
    if (key === null) continue;
    const entry = stats.get(key);
    if (entry) {
      entry.end = col;
      entry.weeks += 1;
    } else {
      stats.set(key, { start: col, end: col, weeks: 1 });
    }
  }
  return [...stats.entries()]
    .filter(([, stat]) => stat.weeks >= 3)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, stat]) => ({
      name: `${Number(key.slice(5))}月`,
      colSpan: stat.end - stat.start + 1,
    }));
}

/** Loading month labels: fixed col spans over the current year layout. */
export function buildLoadingMonthLabels(): SnHeatmapMonthLabel[] {
  return LOADING_MONTH_COL_SPANS.map((colSpan, i) => ({
    name: `${i + 1}月`,
    colSpan,
  }));
}
