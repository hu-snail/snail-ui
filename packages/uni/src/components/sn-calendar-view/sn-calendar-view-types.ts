/**
 * sn-calendar-view — shared types (uni-end).
 *
 * Lives beside the SFC because `<script setup>` cannot export values; the
 * `sn-calendar` wrapper imports these so the pair shares one contract.
 */

/**
 * Calendar selection mode.
 *
 * `week` / `weekrange` are intentionally absent: uni-app miniprograms have no
 * reliable ISO-week helper on every target, so the week modes are documented
 * as 「未实现」 instead of shipping a half-working grid (CONTRIBUTING §9).
 */
export type CalendarType =
  'date' | 'dates' | 'datetime' | 'month' | 'daterange' | 'datetimerange' | 'monthrange';

/** Cell state reported by `formatter` / consumed by the CSS. */
export type CalendarDayType =
  | 'selected'
  | 'start'
  | 'end'
  | 'middle'
  | 'same'
  | 'current'
  | 'multiple-middle'
  | 'multiple-selected'
  | '';

/** Payload handed to the `formatter` hook. */
export interface CalendarDayItem {
  /** 13-digit timestamp of the cell (local midnight). */
  date: number;
  /** Cell state. */
  type: CalendarDayType;
  /** Text rendered inside the cell. */
  text: string;
  /** Caption above the day number. */
  topInfo: string;
  /** Caption below the day number. */
  bottomInfo: string;
  /** Whether the cell is disabled. */
  disabled: boolean;
}

/** `formatter` return: any subset of the cell fields. */
export type CalendarFormatter = (day: CalendarDayItem) => Partial<CalendarDayItem> | undefined;

/** Time filter — receives `['hour', 'minute', 'second']` style values. */
export type CalendarTimeFilter = (type: 'hour' | 'minute' | 'second', values: number[]) => number[];

/** Calendar value: single timestamp, timestamp list, or nothing. */
export type CalendarValue = number | number[] | null;
