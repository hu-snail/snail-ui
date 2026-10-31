/**
 * sn-cell contract — group context inherited by every child cell.
 *
 * wd-cell documents six props as "继承自 CellGroup" (`border`, `titleWidth`,
 * `center`, `layout`, `valueAlign`, plus the group's own `border`). The group
 * provides them through `provide()`; a cell only falls back to the group value
 * when its own prop is `undefined`, so an explicit per-cell prop still wins.
 * The group's `card` flag is NOT part of the context — it styles the group
 * container itself (one card for the whole group, AGENTS.md §112.3a); a
 * per-row card is a cell-level `card` prop only.
 */

import type { InjectionKey, Ref } from 'vue';

/** Cell layout direction. */
export type SnCellLayout = 'horizontal' | 'vertical';

/** Right-hand value alignment. */
export type SnCellValueAlign = 'left' | 'right' | 'center';

/** Asterisk position for required cells. */
export type SnCellAsteriskPosition = 'start' | 'end';

/** Values a cell inherits from its group. */
export interface SnCellGroupContext {
  /** Group-level border flag. */
  border: Ref<boolean>;
  /** Group-level title column width. */
  titleWidth: Ref<string | number | undefined>;
  /** Group-level vertical centering. */
  center: Ref<boolean>;
  /** Group-level layout. */
  layout: Ref<SnCellLayout>;
  /** Group-level value alignment. */
  valueAlign: Ref<SnCellValueAlign>;
  /** Group-level insert (rounded container) flag. */
  insert: Ref<boolean>;
}

export const SN_CELL_GROUP_KEY: InjectionKey<SnCellGroupContext> = Symbol('sn-cell-group');
