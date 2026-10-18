/**
 * Shared types for SnDataTable — internal to `src/data-table/`.
 *
 * Mirrors naive-ui `n-data-table`'s column / filter / sort / summary contract
 * (https://github.com/tusen-ai/naive-ui/tree/main/src/data-table/src/interface.ts)
 * with the subset the web component implements. Kept in a plain `.ts` module
 * (same convention as sn-select-types.ts / sn-checkbox-types.ts) so no shared
 * wiring (install.ts / index.ts / resolver.ts) is touched.
 */

import type { VNodeChild } from 'vue'

/** Row identity value — mirrors naive-ui `RowKey`. */
export type DataTableRowKey = string | number

/** Column key — mirrors naive-ui `ColumnKey`. */
export type DataTableColumnKey = string | number

/** Loose row data record — mirrors naive-ui `RowData`. */
export type DataTableRowData = Record<string, unknown>

/** Sort direction — mirrors naive-ui `SortOrder`. */
export type DataTableSortOrder = 'ascend' | 'descend' | false

/** Filter option entry for a column's filter menu — mirrors naive-ui `FilterOption`. */
export interface DataTableFilterOption {
  label: string
  value: string | number
}

/** One active sorter — mirrors naive-ui `SortState` / `DataTableSortState`. */
export interface DataTableSortState {
  columnKey: DataTableColumnKey
  sorter: 'default' | boolean | ((row1: DataTableRowData, row2: DataTableRowData) => number)
  order: DataTableSortOrder
}

/** Active filter values keyed by column key — mirrors naive-ui `FilterState`. */
export type DataTableFilterState = Record<
  string,
  ReadonlyArray<string | number> | string | number | null | undefined
>

/** Comparison fn for `sorter` — mirrors naive-ui `CompareFn`. */
export type DataTableCompareFn = (
  row1: DataTableRowData,
  row2: DataTableRowData,
) => number

/**
 * Summary payload cell — mirrors naive-ui `SummaryCell`.
 * `rowSpan` is accepted in the type but not rendered (see SFC divergences).
 */
export interface DataTableSummaryCell {
  value?: VNodeChild
  colSpan?: number
  rowSpan?: number
}

/** Summary row keyed by column key — mirrors naive-ui `SummaryRowData`. */
export type DataTableSummaryRow = Record<string, DataTableSummaryCell>

/** `summary` prop signature — mirrors naive-ui `DataTableCreateSummary`. */
export type DataTableCreateSummary = (
  pageData: DataTableRowData[],
) => DataTableSummaryRow | DataTableSummaryRow[]

/** Shared geometry / styling fields — mirrors naive-ui `CommonColumnInfo`. */
export interface DataTableCommonColumnInfo {
  align?: 'left' | 'center' | 'right'
  titleAlign?: 'left' | 'center' | 'right'
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  fixed?: 'left' | 'right' | false
  className?: string
  ellipsis?: boolean
}

/** Regular data column — mirrors naive-ui `TableBaseColumn` (implemented subset). */
export interface DataTableBaseColumn extends DataTableCommonColumnInfo {
  type?: never
  /** Unique column key. Required. */
  key: DataTableColumnKey
  /** Header label — string or render fn. */
  title?: string | ((column: DataTableBaseColumn) => VNodeChild)
  /** Row sorter: `'default'` uses the built-in compare; fn like Array.sort; `true` renders the icon only. */
  sorter?: 'default' | boolean | DataTableCompareFn
  /** Uncontrolled initial sort direction. */
  defaultSortOrder?: DataTableSortOrder
  /** Controlled sort direction — any non-undefined value switches the column (and table) to controlled mode. */
  sortOrder?: DataTableSortOrder
  /** Enable the filter menu; requires `filterOptions`. `'default'` uses substring matching. */
  filter?: 'default' | boolean | ((filterOptionValue: string | number, row: DataTableRowData) => boolean)
  filterOptions?: DataTableFilterOption[]
  /** Multiple selectable filter options (default true). */
  filterMultiple?: boolean
  /** `'or'` keeps rows matching any active value; `'and'` requires all. */
  filterMode?: 'or' | 'and'
  /** Uncontrolled initial filter values (multiple mode). */
  defaultFilterOptionValues?: Array<string | number> | null
  /** Uncontrolled initial filter value (single mode). */
  defaultFilterOptionValue?: string | number | null
  /** Controlled filter values (multiple mode) — defined value switches to controlled. */
  filterOptionValues?: Array<string | number> | null
  /** Controlled filter value (single mode) — defined value switches to controlled. */
  filterOptionValue?: string | number | null
  /** Cell renderer — receives the row and its page-local row index. */
  render?: (rowData: DataTableRowData, rowIndex: number) => VNodeChild
}

/** Selection column — mirrors naive-ui `TableSelectionColumn`. */
export interface DataTableSelectionColumn extends DataTableCommonColumnInfo {
  type: 'selection'
  /** false renders radio-like single selection (no header check-all). */
  multiple?: boolean
  /** Per-row disable predicate — replaces the non-naive `get-checkbox-props`. */
  disabled?: (row: DataTableRowData) => boolean
}

/** Expand column — mirrors naive-ui `TableExpandColumn`. */
export interface DataTableExpandColumn extends DataTableCommonColumnInfo {
  type: 'expand'
  title?: string | ((column: DataTableExpandColumn) => VNodeChild)
  /** Expanded area content renderer. */
  renderExpand: (rowData: DataTableRowData, rowIndex: number) => VNodeChild
  /** Rows returning false render a placeholder instead of the trigger. */
  expandable?: (row: DataTableRowData) => boolean
}

/**
 * Index column — task-spec extension (naive-ui has no index type; naive
 * renders index numbers via a base column with `render`). Renders the
 * 1-based page-local row number.
 */
export interface DataTableIndexColumn extends DataTableCommonColumnInfo {
  type: 'index'
  /** Optional key (defaults to a synthesized `__sn_index__` key). */
  key?: DataTableColumnKey
  title?: string
}

/** Union of supported column shapes — mirrors naive-ui `TableColumn`. */
export type DataTableColumn
  = | DataTableBaseColumn
    | DataTableSelectionColumn
    | DataTableExpandColumn
    | DataTableIndexColumn

/** Column list — mirrors naive-ui `TableColumns`. */
export type DataTableColumns = DataTableColumn[]

/**
 * Built-in simplified pagination config — mirrors the used subset of
 * naive-ui `PaginationProps` (SnPagination is a future marker:
 * AUI-WEB-DATA-008).
 */
export interface DataTablePagination {
  /** Controlled current page. */
  page?: number
  /** Uncontrolled initial page. */
  defaultPage?: number
  /** Controlled page size. */
  pageSize?: number
  /** Uncontrolled initial page size. */
  defaultPageSize?: number
  /** Rendered total text (local mode defaults to the filtered row count). */
  itemCount?: number
  /** Explicit page count override. */
  pageCount?: number
  /** Show the page-size native select. */
  showSizePicker?: boolean
  /** Page-size options for the picker. */
  pageSizes?: number[]
  /** Called together with `update:page`. */
  onChange?: (page: number) => void
  /** Called together with `update:page-size`. */
  onUpdatePageSize?: (pageSize: number) => void
}

/** Internal column view model — resolved key + sticky offsets (internal). */
export interface DataTableColumnMeta {
  column: DataTableColumn
  key: string
  isFixedLeft: boolean
  isFixedRight: boolean
  leftOffset: number
  rightOffset: number
}
