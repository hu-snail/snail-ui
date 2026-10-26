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
}
