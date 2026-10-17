/**
 * SnTimePicker shared types + pure time helpers — internal to
 * `src/time-picker/`.
 *
 * The public value contract is a millisecond timestamp (number) whose
 * time-of-day part is what the picker edits, interpreted in the host's
 * local timezone (Date#getHours / Date#setHours — the same convention
 * the reference library uses).
 *
 * Helpers are pure and exported so tests can exercise the arithmetic
 * directly (AGENTS.md §43/§46). Kept in a plain `.ts` module (same
 * convention as sn-checkbox-types.ts / sn-select-types.ts) so no shared
 * wiring (install.ts / index.ts / resolver.ts) is touched.
 */

/** Display format — also decides whether the seconds column renders. */
export type SnTimePickerFormat = 'HH:mm' | 'HH:mm:ss'

/** Visual size preset (AUI convention adds `mini` below the reference `tiny`). */
export type SnTimePickerSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large'

/** Validation-driven visual status. */
export type SnTimePickerStatus = 'default' | 'error' | 'warning'

/** Time-of-day parts (local timezone) derived from a timestamp. */
export interface SnTimeParts {
  hour: number
  minute: number
  second: number
}

/** Two-digit zero padding for column cell labels ('05'). */
export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** Inclusive integer range [min, max]. */
export function rangeInclusive(min: number, max: number): number[] {
  const out: number[] = []
  for (let v = min; v <= max; v += 1) out.push(v)
  return out
}

/** 24h → 12h hour face (0 → 12, 12 → 12, 13 → 1). */
export function to12Hour(hour24: number): number {
  const h = hour24 % 12
  return h === 0 ? 12 : h
}

/** 12h + period → 24h (12 AM → 0, 12 PM → 12, 5 PM → 17). */
export function to24Hour(hour12: number, isPM: boolean): number {
  return (hour12 % 12) + (isPM ? 12 : 0)
}

/** Whether a 24h hour is in the afternoon/evening half. */
export function isPMHour(hour24: number): boolean {
  return hour24 >= 12
}

/** Step by ±1 inside [min, max], wrapping at both ends. */
export function wrapStep(value: number, delta: 1 | -1, min: number, max: number): number {
  const next = value + delta
  if (next < min) return max
  if (next > max) return min
  return next
}

/** Split a millisecond timestamp into local time-of-day parts. */
export function getTimeParts(ms: number): SnTimeParts {
  const d = new Date(ms)
  return { hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds() }
}

/** Rebuild a timestamp: keep `baseMs`'s date, replace the time-of-day. */
export function buildTimestamp(baseMs: number, parts: SnTimeParts): number {
  const d = new Date(baseMs)
  d.setHours(parts.hour, parts.minute, parts.second, 0)
  return d.getTime()
}

/** Format time-of-day parts for the trigger display. */
export function formatTimeOfDay(
  parts: SnTimeParts,
  options: { use12Hours?: boolean; showSeconds?: boolean } = {},
): string {
  const { use12Hours = false, showSeconds = true } = options
  const { hour, minute, second } = parts
  if (use12Hours) {
    const head = `${pad2(to12Hour(hour))}:${pad2(minute)}`
    const period = isPMHour(hour) ? 'PM' : 'AM'
    return showSeconds ? `${head}:${pad2(second)} ${period}` : `${head} ${period}`
  }
  const head = `${pad2(hour)}:${pad2(minute)}`
  return showSeconds ? `${head}:${pad2(second)}` : head
}
