/**
 * Date helpers shared by `sn-datetime-picker-view`, `sn-datetime-picker`,
 * `sn-calendar-view` and `sn-calendar`.
 *
 * Pure functions only (AGENTS.md §27: normalizers must be deterministic,
 * pure and idempotent). No `Date` mutation escapes these helpers — every
 * function returns a fresh value.
 */

/** Picker column kind. */
export type DateTimeColumnType = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second'

/** `DateTimeType` — the column set a picker shows. */
export type DateTimeType = 'datetime' | 'date' | 'year-month' | 'time' | 'year'

/** Two-digit zero pad. */
export function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

/** Number of days in `month` (1-based) of `year`. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Day of week (0 = Sunday) for a `year` / `month` / `date` triple. */
export function weekdayOf(year: number, month: number, date: number): number {
  return new Date(year, month - 1, date).getDay()
}

/** Start of day timestamp. */
export function startOfDay(timestamp: number): number {
  const d = new Date(timestamp)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** `YYYY-MM-DD` from a timestamp. */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** `HH:mm` or `HH:mm:ss` from a timestamp. */
export function formatTime(timestamp: number, withSecond = false): string {
  const d = new Date(timestamp)
  const base = `${pad(d.getHours())}:${pad(d.getMinutes())}`
  return withSecond ? `${base}:${pad(d.getSeconds())}` : base
}

/** Date parts used by the roller columns. */
export interface DateParts {
  year: number
  month: number
  date: number
  hour: number
  minute: number
  second: number
}

/** Split a timestamp into parts (local time). */
export function toParts(timestamp: number): DateParts {
  const d = new Date(timestamp)
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
  }
}

/** Rebuild a timestamp from parts, rolling over invalid day counts. */
export function fromParts(parts: DateParts): number {
  const maxDay = daysInMonth(parts.year, parts.month)
  const day = Math.min(Math.max(parts.date, 1), maxDay)
  return new Date(
    parts.year,
    parts.month - 1,
    day,
    parts.hour,
    parts.minute,
    parts.second,
  ).getTime()
}

/**
 * Parse `modelValue` into parts.
 *
 * `time` type accepts `HH:mm` / `HH:mm:ss` strings; every other type accepts a
 * millisecond timestamp (or a numeric string). Falls back to `fallback` when
 * the input cannot be parsed.
 */
export function parseModelValue(
  value: string | number | undefined | null,
  type: DateTimeType,
  fallback: number,
): DateParts {
  if (value === undefined || value === null || value === '') return toParts(fallback)
  if (type === 'time') {
    const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(String(value))
    if (!match) return toParts(fallback)
    return {
      year: 1970,
      month: 1,
      date: 1,
      hour: Number(match[1] ?? 0),
      minute: Number(match[2] ?? 0),
      second: Number(match[3] ?? 0),
    }
  }
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return toParts(fallback)
  return toParts(numeric)
}

/** Column set per `DateTimeType`, in display order. */
export function columnsForType(type: DateTimeType): DateTimeColumnType[] {
  switch (type) {
    case 'date': return ['year', 'month', 'date']
    case 'year-month': return ['year', 'month']
    case 'year': return ['year']
    case 'time': return ['hour', 'minute']
    default: return ['year', 'month', 'date', 'hour', 'minute']
  }
}

/** Inclusive numeric range as an array. */
export function range(from: number, to: number): number[] {
  const list: number[] = []
  const start = Math.min(from, to)
  const end = Math.max(from, to)
  for (let value = start; value <= end; value += 1) list.push(value)
  return list
}
