/**
 * SnMention shared types — internal to `src/mention/`.
 *
 * Mirrors naive-ui `n-mention`'s option shape: an option is either a plain
 * string, or an object with a `label` and an optional committed `value`
 * (defaults to the label).
 *
 * Kept in a plain `.ts` module (same convention as
 * sn-auto-complete-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Object form of one candidate option. */
export interface SnMentionOption {
  /** Display label. */
  label: string
  /** Text committed on selection. Defaults to `label`. */
  value?: string
  /** Disable just this option (renders disabled, not selectable). */
  disabled?: boolean
}

/** Anything accepted in the `options` prop array. */
export type SnMentionRawOption = string | SnMentionOption
