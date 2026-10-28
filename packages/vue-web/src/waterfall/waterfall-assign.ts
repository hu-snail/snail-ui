/**
 * Waterfall column allocation — the placement math behind SnWaterfall.
 *
 * Kept as pure functions so the interesting behaviour (reading order,
 * shortest-column placement, append-only stability, the no-measurement
 * fallback) is unit-testable without a layout engine — happy-dom has neither
 * measurement nor ResizeObserver.
 *
 * Vocabulary:
 *   - "key"    — a slot child's identity (`:key` of a v-for, or its index).
 *   - "column" — the ordered list of keys rendered in one flex column.
 *   - "height" — the measured height of an item (0 until measured).
 */

/**
 * Total height of a column, including the gaps between its items.
 *
 * The trailing gap is intentionally excluded: the column is a flex container
 * with `row-gap`, so the gap only ever exists *between* two items.
 */
export function columnHeight(
  column: readonly string[],
  heights: Map<string, number>,
  rowGap: number,
): number {
  let total = 0;
  for (const key of column) total += heights.get(key) ?? 0;
  if (column.length > 1) total += rowGap * (column.length - 1);
  return total;
}

/** True once at least one item reported a usable (non-zero) height. */
export function hasMeasurement(heights: Map<string, number>): boolean {
  for (const height of heights.values()) if (height > 0) return true;
  return false;
}

/** First occurrence of each key, preserving order. */
function dedupe(keys: readonly string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const key of keys) {
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(key);
  }
  return unique;
}

/** Index of the shortest column; ties resolve to the leftmost column. */
function shortestColumn(scores: readonly number[]): number {
  let target = 0;
  let shortest = scores[0] ?? 0;
  for (let index = 1; index < scores.length; index += 1) {
    const score = scores[index] ?? 0;
    if (score < shortest) {
      shortest = score;
      target = index;
    }
  }
  return target;
}

/**
 * Estimated height of an item that has not been measured yet.
 *
 * A brand-new item contributes 0px until its `ResizeObserver` entry arrives,
 * which would score every column equally and pile the whole batch into one
 * column. Using the average of the measured heights keeps the batch balanced;
 * with nothing measured at all the caller falls back to round-robin.
 */
function estimateUnknownHeight(heights: Map<string, number>): number {
  let total = 0;
  let count = 0;
  for (const height of heights.values()) {
    if (height > 0) {
      total += height;
      count += 1;
    }
  }
  return count === 0 ? 0 : total / count;
}

/**
 * Place every key from scratch (no previous allocation to preserve).
 *
 * Unmeasured → round-robin, so the columns stay balanced and the reading order
 * runs left-to-right without any geometry. Measured → shortest column, which
 * is the actual masonry pack; an item that has not been measured yet is
 * charged the average measured height rather than 0, so a freshly appended
 * batch spreads across the columns instead of stacking into whichever column
 * happens to be shortest first.
 */
function distribute(
  keys: readonly string[],
  columnCount: number,
  heights: Map<string, number>,
  rowGap: number,
): string[][] {
  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  if (!hasMeasurement(heights)) {
    keys.forEach((key, index) => columns[index % columnCount]?.push(key));
    return columns;
  }
  const estimate = estimateUnknownHeight(heights);
  const scores = new Array<number>(columnCount).fill(0);
  for (const key of keys) {
    const target = shortestColumn(scores);
    columns[target]?.push(key);
    const measured = heights.get(key);
    scores[target] =
      (scores[target] ?? 0) +
      (measured !== undefined && measured > 0 ? measured : estimate) +
      rowGap;
  }
  return columns;
}

/**
 * Place `keys` into `columnCount` columns.
 *
 * `previous` is the allocation rendered last time (null on first render and
 * after a column-count change):
 *
 *   - Existing keys keep their column. An item that is already on screen never
 *     moves because a later item (or a late-loading image) grew a column — that
 *     is what keeps scrolling smooth and images from re-loading.
 *   - Keys that disappeared from the slot are dropped from their column.
 *   - New keys are appended, in slot order, to the currently shortest column
 *     (round-robin while nothing has been measured yet).
 *   - A different `columnCount` discards `previous` and redistributes all keys,
 *     because the old column membership cannot be preserved.
 */
export function allocateWaterfallColumns(
  keys: readonly string[],
  previous: readonly string[][] | null,
  columnCount: number,
  heights: Map<string, number>,
  rowGap: number,
): string[][] {
  const count = Math.max(1, Math.floor(columnCount));
  const unique = dedupe(keys);
  if (!previous || previous.length !== count) return distribute(unique, count, heights, rowGap);

  const present = new Set(unique);
  const columns = previous.map((column) => column.filter((key) => present.has(key)));
  const placed = new Set(columns.flat());
  const fresh = unique.filter((key) => !placed.has(key));
  if (fresh.length === 0) return columns;

  if (!hasMeasurement(heights)) {
    fresh.forEach((key, index) => columns[index % count]?.push(key));
    return columns;
  }

  const estimate = estimateUnknownHeight(heights);
  const scores = columns.map((column) => columnHeight(column, heights, rowGap));
  for (const key of fresh) {
    const target = shortestColumn(scores);
    columns[target]?.push(key);
    const measured = heights.get(key);
    scores[target] =
      (scores[target] ?? 0) +
      (measured !== undefined && measured > 0 ? measured : estimate) +
      rowGap;
  }
  return columns;
}

/**
 * Column count for `minColumnWidth` (responsive) mode:
 * `floor((width + gap) / (minWidth + gap))`, at least 1.
 *
 * Non-finite / non-positive inputs fall back to a single column instead of
 * producing NaN or a negative count.
 */
export function resolveResponsiveColumnCount(
  width: number,
  minColumnWidth: number,
  columnGap: number,
): number {
  if (!Number.isFinite(width) || width <= 0) return 1;
  if (!Number.isFinite(minColumnWidth) || minColumnWidth <= 0) return 1;
  const gap = Number.isFinite(columnGap) && columnGap > 0 ? columnGap : 0;
  return Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
}

/**
 * A gap / min-width prop as px for the placement math.
 *
 * Numbers pass through; strings are parsed with `parseFloat`, which treats the
 * numeric part as px (`'12rem'` → 12). That is a documented approximation: the
 * CSS still receives the original string, and only the relative column scores
 * use this value, so a `rem` gap cannot misplace more than its rounding.
 */
export function parsePx(value: number | string): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
