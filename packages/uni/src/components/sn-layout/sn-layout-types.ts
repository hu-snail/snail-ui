/**
 * sn-layout contract — shared types for `sn-layout` / `sn-col`.
 *
 * The layout row publishes its gutter through `provide()`; columns read it back and
 * turn it into symmetric horizontal padding. The negative margin on the row
 * plus that padding is what makes a 24-column grid with gutters line up flush
 * with the container edge.
 */

import type { InjectionKey, Ref } from 'vue';

/** Main-axis alignment — mirrors the row half of `wd-layout` `justify`. */
export type SnLayoutJustify =
  'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

/** Cross-axis alignment — mirrors the row half of `wd-layout` `align`. */
export type SnLayoutAlign = 'top' | 'middle' | 'bottom';

/** Context injected by `SnLayout` into child `SnCol` instances. */
export interface SnLayoutContext {
  /** Gutter in px (0 = no gutter). */
  gutter: Ref<number>;
}

export const SN_LAYOUT_KEY: InjectionKey<SnLayoutContext> = Symbol('sn-layout');
