/**
 * sn-table contract — shared types for `sn-table` / `sn-table-column`.
 *
 * The container provides this context through `provide()`; columns read it with
 * `inject()` and register themselves, so column order is DOM order — the same
 * layout `sn-tabs` / `sn-sidebar` use.
 */

import type { InjectionKey, Ref } from 'vue'

/** Content alignment. Mirrors `wd-table-column` `align`. */
export type SnTableAlign = 'left' | 'center' | 'right'

/** Sort direction of a sortable column; `none` = unsorted. */
export type SnTableSortOrder = 'asc' | 'desc' | 'none'

/** One row. `unknown` values (AGENTS.md §12 — no `any`). */
export type SnTableRow = Record<string, unknown>

/** Column config accepted by the `index` prop of `sn-table`. */
export interface SnTableIndexConfig {
  /** Header label of the index column; `''` renders an empty header cell. */
  label?: string
  /** Column width — a bare number is design px. */
  width?: string | number
  /** Content alignment. */
  align?: SnTableAlign
}

/** A column as registered by `sn-table-column` and resolved by the container. */
export interface SnTableColumn {
  /** Data field name (and `v-for` key). */
  prop: string
  /** Header label. */
  label: string
  /** Column width as declared (`string | number`); the container resolves it. */
  width: string | number
  /** Whether the header toggles a sort order. */
  sortable: boolean
  /** Pin the column to the left edge while the body scrolls horizontally. */
  fixed: boolean
  /** Content alignment. */
  align: SnTableAlign
  /** Current sort order (only meaningful when `sortable`). */
  sortOrder: SnTableSortOrder
}
/** One registered column; getters keep the container's render reactive. */
export interface SnTableColumnEntry {
  /** Stable registration id. */
  uid: number
  /** Current column definition. */
  getColumn: () => SnTableColumn
  /** Set the sort order the container asked for. */
  setSortOrder: (order: SnTableSortOrder) => void
  /** Custom cell renderer supplied through the column's `value` slot. */
  getValueSlot: () => ((props: { row: SnTableRow; index: number }) => unknown) | undefined
}

/** Context injected by `SnTable` into `SnTableColumn` instances. */
export interface SnTableContext {
  /** Registered columns in DOM order. */
  columns: Ref<SnTableColumnEntry[]>
  /** Register a column; returns its stable id. */
  registerColumn: (entry: SnTableColumnEntry) => void
  /** Drop a column when it unmounts. */
  unregisterColumn: (uid: number) => void
  /** Header tap on a sortable column — cycles the order and emits `sort-method`. */
  toggleSort: (uid: number) => void
}

export const SN_TABLE_KEY: InjectionKey<SnTableContext> = Symbol('sn-table')
