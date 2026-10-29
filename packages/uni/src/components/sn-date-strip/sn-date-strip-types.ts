/**
 * sn-date-strip shared types.
 *
 * Values are local-midnight millisecond timestamps, matching
 * `sn-calendar-view`'s value model.
 */

/** One rendered day cell (also the `formatter` hook's input / output). */
export interface DateStripDayItem {
  /** Local midnight timestamp. */
  date: number;
  /** Day of month (1-based). */
  day: number;
  /** Weekday (0 = Sunday … 6 = Saturday). */
  week: number;
  /** Rendered day text（默认日号）. */
  text: string;
  /** Caption above the number. */
  topInfo: string;
  /** Caption below the number. */
  bottomInfo: string;
  /** Disabled state. */
  disabled: boolean;
}
