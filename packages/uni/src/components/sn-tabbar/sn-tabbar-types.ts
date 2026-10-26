/**
 * sn-tabbar contract — shared types for `sn-tabbar` / `sn-tabbar-item`.
 *
 * The bar provides this context through `provide()`; items read it with
 * `inject()` and derive their own active state from it. Mirrors the
 * `sn-radio-types.ts` pattern so both pairs stay symmetric.
 */

import type { InjectionKey, Ref } from 'vue';

/** Value shared by the bar's selection and each item's `name`. */
export type SnTabbarValue = number | string;

/** Bar shape — mirrors `wd-tabbar` `shape`. */
export type SnTabbarShape = 'default' | 'round';

/** Context injected by `SnTabbar` into child `SnTabbarItem` instances. */
export interface SnTabbarContext {
  /** Currently selected value (index when the item has no `name`). */
  activeValue: Ref<SnTabbarValue>;
  /** Whether `value` is the current selection. */
  isActive: (value: SnTabbarValue) => boolean;
  /** Request a switch; the bar runs `beforeChange` before committing. */
  select: (value: SnTabbarValue) => void;
  /** Assign the next slot index to a freshly mounted item. */
  nextIndex: () => number;
  /** Active label colour (empty string = token default). */
  activeColor: Ref<string>;
  /** Inactive label colour (empty string = token default). */
  inactiveColor: Ref<string>;
  /** Bar shape inherited by every item. */
  shape: Ref<SnTabbarShape>;
}

export const SN_TABBAR_KEY: InjectionKey<SnTabbarContext> = Symbol('sn-tabbar');
