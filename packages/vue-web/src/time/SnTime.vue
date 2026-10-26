<script setup lang="ts">
/**
 * SnTime — web-end time formatter (AUI-WEB-DD-019).
 *
 * Reference library: naive-ui `n-time`
 *   (https://www.naiveui.com/zh-CN/light/components/time)
 * Per AGENTS.md §112, props + semantics mirror n-time 1:1:
 *   time (number | Date, undefined → Date.now()) / to (number | Date,
 *   undefined → Date.now()) / type ('relative' | 'date' | 'datetime',
 *   'datetime') / format / unix (false) / text (false) / time-zone.
 * Renders a native `<time>` element (bare text node when `text`).
 *
 * Documented divergences (not §112 violations):
 *   - naive builds on `date-fns` + `date-fns-tz`; this package has no
 *     date dependency, so:
 *     · `format` supports the common date-fns token subset
 *       (yyyy yy MMMM MMM MM M dd d EEEE EEE HH H hh h mm m ss s SSS a,
 *       plus '…' quoted literals) with zh-CN month / weekday / day-period
 *       names built in.
 *     · `type="relative"` mirrors `formatDistanceStrict(date, to,
 *       { addSuffix: true })` with built-in zh-CN wording
 *       (e.g. 「3 天前」/「2 小时后」); unit durations are fixed
 *       (365d / 30.4375d / 24h / 60m / 1s) with half-up rounding, and a
 *       sub-second distance renders 「不到 1 秒」 (date-fns zh-CN renders
 *       the CLDR quirk 「不到 5 秒」).
 *     · `time-zone` (IANA name) resolves via Intl.DateTimeFormat; it
 *       affects formatted output only, mirroring naive.
 *     · No locale/config-provider integration — zh-CN wording is built in.
 *   - The task briefing mentions a `unix-milliseconds` prop; the naive
 *     source has no such prop, so it is not implemented.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTime :time="0" />
 *   <SnTime :time="0" type="relative" :to="86400000" />
 *   <SnTime :time="4320000" unix format="yyyy-MM-dd hh:mm:ss" />
 *   <SnTime :time="0" time-zone="Asia/Shanghai" />
 */

import { computed } from 'vue';

defineOptions({ name: 'SnTime' });

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  weekday: number; // 0 = Sunday
}

const ZH_MONTHS = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

const ZH_WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const ZH_WEEKDAYS_SHORT = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const INTL_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Unit durations for `type="relative"` (formatDistanceStrict equivalent).
const UNIT_MILLISECONDS: Array<[number, string, string]> = [
  [365 * 86400000, '{count} 年', '1 年'],
  [2629746000, '{count} 个月', '1 个月'],
  [86400000, '{count} 天', '1 天'],
  [3600000, '{count} 小时', '1 小时'],
  [60000, '{count} 分钟', '1 分钟'],
  [1000, '{count} 秒', '1 秒'],
];

const props = withDefaults(
  defineProps<{
    /** Time to render (ms timestamp or Date). Defaults to the mount time. Mirrors n-time `time`. */
    time?: number | Date | undefined;
    /** Rendered representation. Mirrors n-time `type`. */
    type?: 'relative' | 'date' | 'datetime';
    /** Base time for `type="relative"`. Defaults to the mount time. Mirrors n-time `to`. */
    to?: number | Date | undefined;
    /** Interpret `time` / `to` as unix timestamps in seconds. Mirrors n-time `unix`. */
    unix?: boolean;
    /** Custom format string (date-fns token subset, see header). Mirrors n-time `format`. */
    format?: string | undefined;
    /** Render a bare text node instead of a `<time>` element. Mirrors n-time `text`. */
    text?: boolean;
    /** IANA time zone used when formatting. Mirrors n-time `timeZone`. */
    timeZone?: string | undefined;
  }>(),
  {
    time: undefined,
    type: 'datetime',
    to: undefined,
    unix: false,
    format: undefined,
    text: false,
    timeZone: undefined,
  },
);

/** Captured once at setup, like the reference. */
const now = Date.now();

function toDate(time: number | Date | undefined): Date {
  if (time === undefined) return new Date(now);
  return time instanceof Date ? time : new Date(time);
}

function fromUnix(time: number | Date | undefined): Date {
  if (time === undefined) return new Date(now);
  const seconds = time instanceof Date ? time.valueOf() : time;
  return new Date(seconds * 1000);
}

const mergedTime = computed<Date>(() => (props.unix ? fromUnix(props.time) : toDate(props.time)));

const mergedTo = computed<Date>(() => (props.unix ? fromUnix(props.to) : toDate(props.to)));

function getParts(date: Date, timeZone: string | undefined): ZonedParts {
  if (!timeZone) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds(),
      millisecond: date.getMilliseconds(),
      weekday: date.getDay(),
    };
  }
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
  });
  const partValue = (type: string): number => {
    const part = formatter.formatToParts(date).find((item) => item.type === type);
    return part ? Number(part.value) : 0;
  };
  const weekdayName = formatter.formatToParts(date).find((item) => item.type === 'weekday')?.value;
  return {
    year: partValue('year'),
    month: partValue('month'),
    day: partValue('day'),
    // Some ICU versions emit "24" for midnight under h23 — fold it back.
    hour: partValue('hour') % 24,
    minute: partValue('minute'),
    second: partValue('second'),
    millisecond: date.getMilliseconds(),
    weekday: Math.max(0, INTL_WEEKDAYS.indexOf(weekdayName ?? 'Sun')),
  };
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function pad4(value: number): string {
  return String(value).padStart(4, '0');
}

/**
 * date-fns `format` subset. Token regex is ordered longest-first; text
 * outside tokens is literal, and '…' quotes escape literals ('' = ').
 */
const FORMAT_TOKEN_REGEX =
  /(yyyy|yy|MMMM|MMM|MM|M|EEEE|EEE|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|a)|'((?:[^']|'')*)'/g;

function formatToken(token: string, parts: ZonedParts): string {
  switch (token) {
    case 'yyyy':
      return pad4(parts.year);
    case 'yy':
      return pad2(parts.year % 100);
    case 'MMMM':
      return ZH_MONTHS[parts.month - 1] ?? '';
    case 'MMM':
      return `${parts.month}月`;
    case 'MM':
      return pad2(parts.month);
    case 'M':
      return String(parts.month);
    case 'EEEE':
      return ZH_WEEKDAYS[parts.weekday] ?? '';
    case 'EEE':
      return ZH_WEEKDAYS_SHORT[parts.weekday] ?? '';
    case 'dd':
      return pad2(parts.day);
    case 'd':
      return String(parts.day);
    case 'HH':
      return pad2(parts.hour);
    case 'H':
      return String(parts.hour);
    case 'hh':
      return pad2(parts.hour % 12 || 12);
    case 'h':
      return String(parts.hour % 12 || 12);
    case 'mm':
      return pad2(parts.minute);
    case 'm':
      return String(parts.minute);
    case 'ss':
      return pad2(parts.second);
    case 's':
      return String(parts.second);
    case 'SSS':
      return String(parts.millisecond).padStart(3, '0');
    case 'a':
      return parts.hour < 12 ? '上午' : '下午';
    default:
      return token;
  }
}

function formatDate(date: Date, pattern: string, timeZone: string | undefined): string {
  const parts = getParts(date, timeZone);
  let result = '';
  let lastIndex = 0;
  FORMAT_TOKEN_REGEX.lastIndex = 0;
  for (
    let match = FORMAT_TOKEN_REGEX.exec(pattern);
    match !== null;
    match = FORMAT_TOKEN_REGEX.exec(pattern)
  ) {
    result += pattern.slice(lastIndex, match.index);
    if (match[2] !== undefined) {
      result += match[2].replaceAll("''", "'");
    } else if (match[1] !== undefined) {
      result += formatToken(match[1], parts);
    }
    lastIndex = match.index + match[0].length;
  }
  result += pattern.slice(lastIndex);
  return result;
}

/**
 * `formatDistanceStrict(time, to, { addSuffix: true })` equivalent with
 * built-in zh-CN wording: pick the largest unit whose raw ratio reaches 1
 * (half-up rounding happens after unit selection, like the reference),
 * then append 前 (past) / 后 (future).
 */
function formatRelative(diffMilliseconds: number): string {
  const absolute = Math.abs(diffMilliseconds);
  const suffix = diffMilliseconds < 0 ? '前' : '后';
  for (const [unitMilliseconds, plural, singular] of UNIT_MILLISECONDS) {
    if (absolute / unitMilliseconds >= 1) {
      const value = Math.round(absolute / unitMilliseconds);
      return `${value === 1 ? singular : plural.replace('{count}', String(value))}${suffix}`;
    }
  }
  return `不到 1 秒${suffix}`;
}

const renderedTime = computed<string>(() => {
  const time = mergedTime.value;
  if (props.format) {
    return formatDate(time, props.format, props.timeZone);
  }
  if (props.type === 'date') {
    return formatDate(time, 'yyyy-MM-dd', props.timeZone);
  }
  if (props.type === 'datetime') {
    return formatDate(time, 'yyyy-MM-dd HH:mm:ss', props.timeZone);
  }
  return formatRelative(time.getTime() - mergedTo.value.getTime());
});
</script>

<template>
  <template v-if="text">{{ renderedTime }}</template>
  <time v-else data-snui-component="time" class="sn-time">{{ renderedTime }}</time>
</template>
