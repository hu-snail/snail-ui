/**
 * sn-keyboard — shared types (uni-end).
 */

/** Keyboard layout. */
export type KeyboardMode = 'default' | 'custom' | 'car';

/** Car-plate keyboard language. */
export type CarKeyboardLang = 'zh' | 'en';

/** One key definition. */
export interface KeyboardKey {
  /** Key label. */
  text: string;
  /** Value appended to the model when tapped. */
  value: string;
  /** Optional CSS class for the key. */
  className?: string;
  /**
   * Grid columns this key takes (default `1`). Used by `0` to absorb a slot
   * whose `extraKey` was not supplied, so the bottom row never shows a hole.
   */
  span?: number;
}
