/**
 * sn-cell contract — group context inherited by every child cell.
 *
 * wd-cell documents six props as "继承自 CellGroup" (`border`, `titleWidth`,
 * `center`, `layout`, `valueAlign`, plus the group's own `border`). The group
 * provides them through `provide()`; a cell only falls back to the group value
 * when its own prop is `undefined`, so an explicit per-cell prop still wins.
 */

import type { InjectionKey, Ref } from 'vue'

/** Cell layout direction. */
export type SnCellLayout = 'horizontal' | 'vertical'

/** Right-hand value alignment. */
export type SnCellValueAlign = 'left' | 'right' | 'center'

/** Asterisk position for required cells. */
export type SnCellAsteriskPosition = 'start' | 'end'

/** Values a cell inherits from its group. */
export interface SnCellGroupContext {
  /** Group-level border flag. */
  border: Ref<boolean>
  /** Group-level title column width. */
  titleWidth: Ref<string | number | undefined>
  /** Group-level vertical centering. */
  center: Ref<boolean>
  /** Group-level layout. */
  layout: Ref<SnCellLayout>
  /** Group-level value alignment. */
  valueAlign: Ref<SnCellValueAlign>
  /** Group-level card style flag. */
  insert: Ref<boolean>
}

export const SN_CELL_GROUP_KEY: InjectionKey<SnCellGroupContext> = Symbol('sn-cell-group')
