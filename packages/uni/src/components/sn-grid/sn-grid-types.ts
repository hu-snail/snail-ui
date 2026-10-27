/**
 * sn-grid contract — shared types for `sn-grid` / `sn-grid-item`.
 *
 * The grid publishes its layout flags (column count, gutter, square cells,
 * click feedback, hover class, direction, icon size, centering) through
 * `provide()`; items read them back so a single prop on the container drives
 * every cell — wd-grid's documented "配置在 Grid 上，GridItem 继承" contract.
 */

import type { InjectionKey, Ref } from 'vue';

/** Cell content flow direction. */
export type SnGridDirection = 'horizontal' | 'vertical';

/** Context injected by `SnGrid` into child `SnGridItem` instances. */
export interface SnGridContext {
  /** Number of columns. */
  column: Ref<number>;
  /** Cell gutter in px (0 = no gutter). */
  gutter: Ref<number>;
  /** Force square cells. */
  square: Ref<boolean>;
  /** Enable tap feedback on every cell. */
  clickable: Ref<boolean>;
  /** `hover-class` name forwarded to every cell. */
  hoverClass: Ref<string>;
  /** Center cell content. */
  center: Ref<boolean>;
  /** Cell content flow direction. */
  direction: Ref<SnGridDirection>;
  /** Swap icon and text. */
  reverse: Ref<boolean>;
  /** Draw the cell hairline borders; replaces a `:deep()` rule App cannot express. */
  border: Ref<boolean>;
  /** Icon size inherited by every cell. */
  iconSize: Ref<string>;
}

export const SN_GRID_KEY: InjectionKey<SnGridContext> = Symbol('sn-grid');
