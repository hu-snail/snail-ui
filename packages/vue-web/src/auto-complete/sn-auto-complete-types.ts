/**
 * SnAutoComplete shared types — internal to `src/auto-complete/`.
 *
 * Mirrors naive-ui `n-auto-complete`'s option shape: an option is either a
 * plain string, or an object whose `label` may be a string or an array of
 * strings (nested label segments get per-segment highlight treatment).
 *
 * Kept inside the folder so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Option label — a plain string, or nested segments (each segment is matched independently). */
export type SnAutoCompleteOptionLabel = string | string[];

/** Object form of one candidate option. */
export interface SnAutoCompleteOption {
  /** Display label; string or nested segments. */
  label?: SnAutoCompleteOptionLabel;
  /** Value committed on selection. Defaults to the joined label. */
  value?: string;
  /** Disable just this option (renders disabled, not selectable). */
  disabled?: boolean;
}

/** Anything accepted in the `options` prop array. */
export type SnAutoCompleteRawOption = string | SnAutoCompleteOption;

/**
 * `getShow` — dynamically computes the candidate list from the current
 * input value (naive-ui `get-show`). Overrides the static `options` prop.
 */
export type SnAutoCompleteGetShow = (value: string) => SnAutoCompleteRawOption[];
