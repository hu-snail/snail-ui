<script setup lang="ts">
/**
 * SnDataTable — web-end data table (AUI-WEB-DD-004).
 *
 * Reference library: naive-ui `n-data-table`
 *   (https://www.naiveui.com/zh-CN/light/components/data-table)
 * Per AGENTS.md §112, props + semantics mirror n-data-table 1:1 (subset):
 *   columns / data / row-key / row-props / row-class-name / striped / size /
 *   bordered / bottom-bordered / single-line / single-column / loading /
 *   scroll-x / max-height / checked-row-keys (v-model) /
 *   default-checked-row-keys / expanded-row-keys (v-model) /
 *   default-expanded-row-keys / summary / summary-placement / pagination /
 *   on-update:checked-row-keys / on-update:expanded-row-keys /
 *   on-update:filters / on-update:sorter / on-update:page /
 *   on-update:page-size. Column contract (key / title / align / width /
 *   min-width / max-width / fixed / sorter / default-sort-order / sort-order /
 *   filter / filter-options / filter-multiple / filter-mode /
 *   filter-option-values / filter-option-value / default-filter-option-*
 *   / ellipsis / render / className / type selection|expand|index /
 *   multiple / disabled / expandable / render-expand) lives in
 *   ./sn-data-table-types.ts.
 *
 * Documented divergences (not §112 violations):
 *   - DOM: one scroll container + `position: sticky` thead instead of
 *     naive-ui's header/body dual-table scroll sync; no colgroup (widths are
 *     applied to th/td directly). `max-height` still yields a sticky header.
 *   - Sorter glyph mirrors naive's single rotating arrow (ascend rotates
 *     -180deg), not a double-triangle glyph.
 *   - Filter menu is an inline absolute panel closed by outside click
 *     (naive-ui uses a teleported Popover). Single-mode filters commit
 *     immediately on option click; multiple-mode commits on 确认 / resets on
 *     重置. Filter state shape follows `filterMultiple` (naive keeps a
 *     legacy `shouldUseArray` compat path).
 *   - Built-in pagination is a simplified bar (page window / prev-next /
 *     native select size picker / total prefix); naive delegates to the full
 *     NPagination. SnPagination is a future marker (AUI-WEB-DATA-008).
 *   - `summary` supports `value` + `colSpan`; `rowSpan` is accepted in the
 *     type but not rendered.
 *   - `type: 'index'` column is a task-spec extension (naive-ui renders
 *     index numbers via a base column with `render`).
 *   - `get-checkbox-props` is not implemented (not a naive-ui prop); per-row
 *     disabling uses the selection column's `disabled(row)`.
 *   - Row checkbox clicks stop propagation (naive-ui lets them reach
 *     rowProps onClick).
 *   - ellipsis renders a plain `title` tooltip; the n-ellipsis float is a
 *     future marker.
 *   - Theme tokens are mapped to `--sn-web-*` via color-mix on
 *     text-primary / surface (naive light.ts weights): inner grid lines are
 *     a 6% hairline, the outer frame + control outlines 12%, header bg 2%,
 *     row hover 3%, striped 2%. The old border-subtle / background-subtle
 *     semantic tiers were the "thick border" root cause.
 *
 * Deferred (future markers, not in the public API yet): virtual-scroll,
 * flex-height, resizable columns, column drag sort, tree data
 * (childrenKey / indent / cascade), ellipsis tooltip float, remote data,
 * default-expand-all, loading slot, render-cell / render-expand-icon /
 * render-filter-menu hooks, CSV export, exposed methods
 * (sort/filter/page/scrollTo/...).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnDataTable :columns="columns" :data="data" :pagination="{ pageSize: 10 }" />
 *   <SnDataTable :columns="columns" :data="data"
 *     v-model:checked-row-keys="keys" @update:sorter="onSorter" />
 */

import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import type { PropType, VNodeChild } from 'vue'
import type { HTMLAttributes } from 'vue'
import type {
  DataTableBaseColumn,
  DataTableColumn,
  DataTableColumnKey,
  DataTableColumnMeta,
  DataTableExpandColumn,
  DataTableFilterOption,
  DataTableFilterState,
  DataTablePagination,
  DataTableRowData,
  DataTableRowKey,
  DataTableSelectionColumn,
  DataTableSortOrder,
  DataTableSortState,
  DataTableSummaryRow,
} from './sn-data-table-types'
import type { DataTableCreateSummary } from './sn-data-table-types'

defineOptions({ name: 'SnDataTable' })

const props = withDefaults(
  defineProps<{
    /** Column definitions. Mirrors n-data-table `columns`. */
    columns?: DataTableColumns
    /** Row data records. Mirrors n-data-table `data`. */
    data?: DataTableRowData[]
    /** Derive the row key from a row. Mirrors n-data-table `row-key`. */
    rowKey?: ((row: DataTableRowData) => DataTableRowKey) | undefined
    /** Extra tr attributes. Mirrors n-data-table `row-props`. */
    rowProps?: ((row: DataTableRowData, index: number) => HTMLAttributes) | undefined
    /** Static or computed tr class. Mirrors n-data-table `row-class-name`. */
    rowClassName?: string | ((row: DataTableRowData, index: number) => string) | undefined
    /** Zebra stripes on odd page rows. Mirrors n-data-table `striped`. */
    striped?: boolean
    /** Table scale. Mirrors n-data-table `size`. */
    size?: 'small' | 'medium' | 'large'
    /** Outer frame border; undefined = true. Mirrors n-data-table `bordered`. */
    bordered?: boolean | undefined
    /** Last-row bottom border (no effect while bordered); undefined = true. Mirrors `bottom-bordered`. */
    bottomBordered?: boolean | undefined
    /** Hide column separators. Mirrors n-data-table `single-line`. */
    singleLine?: boolean
    /** Hide row separators. Mirrors n-data-table `single-column`. */
    singleColumn?: boolean
    /** Dim the body and show the centered spinner. Mirrors `loading`. */
    loading?: boolean
    /** Inner table min-width -> horizontal scroll. Mirrors `scroll-x`. */
    scrollX?: number | string | undefined
    /** Scroll container max-height -> sticky header. Mirrors `max-height`. */
    maxHeight?: number | string | undefined
    /** Summary rows factory over the current page data. Mirrors `summary`. */
    summary?: DataTableCreateSummary | undefined
    /** Render summary above or below the body. Mirrors `summary-placement`. */
    summaryPlacement?: 'top' | 'bottom'
    /** Checked keys (v-model:checked-row-keys). Mirrors `checked-row-keys`. */
    checkedRowKeys?: DataTableRowKey[] | undefined
    /** Uncontrolled initial checked keys. Mirrors `default-checked-row-keys`. */
    defaultCheckedRowKeys?: DataTableRowKey[]
    /** Expanded keys (v-model:expanded-row-keys). Mirrors `expanded-row-keys`. */
    expandedRowKeys?: DataTableRowKey[] | undefined
    /** Uncontrolled initial expanded keys. Mirrors `default-expanded-row-keys`. */
    defaultExpandedRowKeys?: DataTableRowKey[]
    /** false disables pagination; object renders the simplified bar. Mirrors `pagination`. */
    pagination?: DataTablePagination | false
  }>(),
  {
    columns: () => [],
    data: () => [],
    rowKey: undefined,
    rowProps: undefined,
    rowClassName: undefined,
    striped: false,
    size: 'medium',
    // happy-dom boolean casting: undefined must stay "not passed" to merge
    // the naive-ui default (true) downstream.
    bordered: undefined,
    bottomBordered: undefined,
    singleLine: true,
    singleColumn: false,
    loading: false,
    scrollX: undefined,
    maxHeight: undefined,
    summary: undefined,
    summaryPlacement: 'bottom',
    checkedRowKeys: undefined,
    defaultCheckedRowKeys: () => [],
    expandedRowKeys: undefined,
    defaultExpandedRowKeys: () => [],
    pagination: false,
  },
)

const emit = defineEmits<{
  (
    e: 'update:checkedRowKeys',
    keys: DataTableRowKey[],
    rows: DataTableRowData[],
    meta: { row: DataTableRowData | undefined, action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll' },
  ): void
  (e: 'update:expandedRowKeys', keys: DataTableRowKey[]): void
  (e: 'update:filters', filters: DataTableFilterState, column: DataTableBaseColumn): void
  (e: 'update:sorter', state: DataTableSortState | DataTableSortState[] | null): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()

defineSlots<{
  /** Replaces the default 无数据 empty state. */
  empty?(): unknown
}>()

/* ------------------------------------------------------------------ */
/* Internal helper: render a user render-fn result (VNodeChild) as-is.  */
/* ------------------------------------------------------------------ */

const VNodeRenderer = defineComponent({
  name: 'SnDataTableVNodeRenderer',
  props: {
    content: {
      type: [String, Number, Boolean, Array, Object] as unknown as PropType<VNodeChild>,
      default: null,
    },
  },
  setup(rendererProps) {
    return () => rendererProps.content
  },
})

/* ------------------------------------------------------------------ */
/* Column helpers                                                       */
/* ------------------------------------------------------------------ */

type DataTableColumns = DataTableColumn[]

function isBaseColumn(column: DataTableColumn): column is DataTableBaseColumn {
  return (column as { type?: string }).type === undefined
}

function isSelectionColumn(column: DataTableColumn): column is DataTableSelectionColumn {
  return column.type === 'selection'
}

function isExpandColumn(column: DataTableColumn): column is DataTableExpandColumn {
  return column.type === 'expand'
}

const SELECTION_COL_WIDTH = 40
const EXPAND_COL_WIDTH = 40

function getColumnKey(column: DataTableColumn): DataTableColumnKey {
  if (isSelectionColumn(column)) return '__sn_selection__'
  if (isExpandColumn(column)) return '__sn_expand__'
  if (column.type === 'index') return `__sn_index__${column.key ?? ''}`
  return column.key
}

function numericColumnWidth(column: DataTableColumn): number {
  const fallback
    = isSelectionColumn(column) || isExpandColumn(column)
      ? SELECTION_COL_WIDTH
      : 0
  if (isSelectionColumn(column) || isExpandColumn(column)) {
    if (column.width === undefined) return fallback
  }
  const raw = column.width
  if (typeof raw === 'number') return raw
  if (typeof raw === 'string') {
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

function cssLen(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const columnMetas = computed<DataTableColumnMeta[]>(() => {
  const metas: DataTableColumnMeta[] = []
  const cols = props.columns
  let leftAcc = 0
  for (const col of cols) {
    if (col.fixed === 'left') {
      metas.push({
        column: col,
        key: String(getColumnKey(col)),
        isFixedLeft: true,
        isFixedRight: false,
        leftOffset: leftAcc,
        rightOffset: 0,
      })
      leftAcc += numericColumnWidth(col)
    } else {
      metas.push({
        column: col,
        key: String(getColumnKey(col)),
        isFixedLeft: false,
        isFixedRight: false,
        leftOffset: 0,
        rightOffset: 0,
      })
    }
  }
  const rightOffsets = new Map<string, number>()
  let rightAcc = 0
  for (let index = cols.length - 1; index >= 0; index -= 1) {
    const col = cols[index]
    if (col === undefined) continue
    if (col.fixed === 'right') {
      rightOffsets.set(String(getColumnKey(col)), rightAcc)
      rightAcc += numericColumnWidth(col)
    }
  }
  for (const meta of metas) {
    const offset = rightOffsets.get(meta.key)
    if (offset !== undefined) {
      meta.isFixedRight = true
      meta.rightOffset = offset
    }
  }
  return metas
})

const hasFixedColumns = computed<boolean>(() =>
  columnMetas.value.some((meta) => meta.isFixedLeft || meta.isFixedRight),
)

const hasEllipsisColumn = computed<boolean>(() =>
  props.columns.some((col) => isBaseColumn(col) && col.ellipsis === true),
)

const tableLayout = computed<'auto' | 'fixed'>(() =>
  props.maxHeight !== undefined || hasEllipsisColumn.value ? 'fixed' : 'auto',
)

/* ------------------------------------------------------------------ */
/* Filtering                                                            */
/* ------------------------------------------------------------------ */

function initialFilterState(): DataTableFilterState {
  const state: DataTableFilterState = {}
  for (const col of props.columns) {
    if (!isBaseColumn(col) || !col.filter) continue
    if (col.filterMultiple === false) {
      state[col.key] = col.defaultFilterOptionValue ?? null
    } else {
      state[col.key] = col.defaultFilterOptionValues ?? []
    }
  }
  return state
}

const uncontrolledFilterState = ref<DataTableFilterState>(initialFilterState())

const mergedFilterState = computed<DataTableFilterState>(() => {
  const state: DataTableFilterState = { ...uncontrolledFilterState.value }
  for (const col of props.columns) {
    if (!isBaseColumn(col)) continue
    if (col.filterOptionValues !== undefined) {
      state[col.key] = col.filterOptionValues
    } else if (col.filterOptionValue !== undefined) {
      state[col.key] = col.filterOptionValue
    }
  }
  return state
})

function defaultFilterOf(
  columnKey: DataTableColumnKey,
): (value: string | number, row: DataTableRowData) => boolean {
  return (value: string | number, row: DataTableRowData) =>
    String(row[columnKey]).indexOf(String(value)) !== -1
}

const filteredData = computed<DataTableRowData[]>(() => {
  const state = mergedFilterState.value
  const activeEntries: Array<{
    column: DataTableBaseColumn
    values: Array<string | number>
  }> = []
  for (const col of props.columns) {
    if (!isBaseColumn(col)) continue
    const active = state[col.key]
    if (active == null) continue
    const values = Array.isArray(active) ? [...active] : [active]
    if (values.length === 0) continue
    activeEntries.push({ column: col, values })
  }
  if (activeEntries.length === 0) return props.data
  return props.data.filter((row) => {
    for (const entry of activeEntries) {
      const filterFn
        = entry.column.filter === 'default'
          ? defaultFilterOf(entry.column.key)
          : typeof entry.column.filter === 'function'
            ? entry.column.filter
            : null
      if (filterFn === null) continue
      if (entry.column.filterMode === 'and') {
        if (entry.values.some((value) => !filterFn(value, row))) return false
      } else if (entry.values.some((value) => filterFn(value, row))) {
        continue
      } else {
        return false
      }
    }
    return true
  })
})

/* ------------------------------------------------------------------ */
/* Sorting                                                              */
/* ------------------------------------------------------------------ */

function nextSortOrder(order: DataTableSortOrder): DataTableSortOrder {
  if (!order) return 'descend'
  if (order === 'descend') return 'ascend'
  return false
}

function initialSortStates(): DataTableSortState[] {
  const states: DataTableSortState[] = []
  for (const col of props.columns) {
    if (!isBaseColumn(col) || col.sorter === undefined) continue
    states.push({
      columnKey: col.key,
      sorter: col.sorter,
      order: col.defaultSortOrder ?? false,
    })
  }
  return states
}

const uncontrolledSortStates = ref<DataTableSortState[]>(initialSortStates())

const mergedSortStates = computed<DataTableSortState[]>(() => {
  const controlledColumns: DataTableBaseColumn[] = []
  for (const col of props.columns) {
    if (
      isBaseColumn(col)
      && col.sorter !== undefined
      && (col.sortOrder === 'ascend'
        || col.sortOrder === 'descend'
        || col.sortOrder === false)
    ) {
      controlledColumns.push(col)
    }
  }
  const activeControlled = controlledColumns.filter(
    (col) => col.sortOrder !== false,
  )
  if (activeControlled.length > 0) {
    return activeControlled.map((col) => ({
      columnKey: col.key,
      sorter: col.sorter as DataTableSortState['sorter'],
      order: col.sortOrder as DataTableSortOrder,
    }))
  }
  if (controlledColumns.length > 0) return []
  return uncontrolledSortStates.value
})

function getFlagOfOrder(order: DataTableSortOrder): number {
  if (order === 'ascend') return 1
  if (order === 'descend') return -1
  return 0
}

function defaultComparator(
  columnKey: DataTableColumnKey,
): (row1: DataTableRowData, row2: DataTableRowData) => number {
  return (row1, row2) => {
    const value1 = row1[columnKey]
    const value2 = row2[columnKey]
    if (value1 == null && value2 == null) return 0
    if (value1 == null) return -1
    if (value2 == null) return 1
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return value1 - value2
    }
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.localeCompare(value2)
    }
    return 0
  }
}

const sortedData = computed<DataTableRowData[]>(() => {
  const base = filteredData.value
  const comparators: Array<{
    flag: number
    compare: (row1: DataTableRowData, row2: DataTableRowData) => number
  }> = []
  for (const state of mergedSortStates.value) {
    const flag = getFlagOfOrder(state.order)
    if (flag === 0) continue
    if (state.sorter === 'default') {
      comparators.push({ flag, compare: defaultComparator(state.columnKey) })
    } else if (typeof state.sorter === 'function') {
      comparators.push({ flag, compare: state.sorter })
    }
  }
  if (comparators.length === 0) return base
  return base.slice().sort((row1, row2) => {
    for (const entry of comparators) {
      const result = entry.compare(row1, row2)
      if (result !== 0) return result * entry.flag
    }
    return 0
  })
})

function isColumnSortable(column: DataTableColumn): boolean {
  return isBaseColumn(column) && !!column.sorter
}

function isColumnSorting(column: DataTableColumn): boolean {
  if (!isBaseColumn(column)) return false
  return mergedSortStates.value.some(
    (state) => state.columnKey === column.key && state.order !== false,
  )
}

function currentSortOrder(column: DataTableColumn): DataTableSortOrder {
  if (!isBaseColumn(column)) return false
  const state = mergedSortStates.value.find(
    (entry) => entry.columnKey === column.key,
  )
  return state?.order !== undefined ? state.order : false
}

function handleSorterClick(column: DataTableBaseColumn): void {
  // naive-ui single-sort semantics: clicking replaces the whole sort state
  // (createNextSorter -> getUpdatedSorterState returns one state).
  const state = uncontrolledSortStates.value.find(
    (entry) => entry.columnKey === column.key,
  )
  const order
    = state === undefined || state.columnKey !== column.key
      ? nextSortOrder(false)
      : nextSortOrder(state.order)
  const next: DataTableSortState = {
    columnKey: column.key,
    sorter: column.sorter ?? false,
    order,
  }
  emit('update:sorter', next)
  uncontrolledSortStates.value = [next]
}

function handleThClick(meta: DataTableColumnMeta): void {
  if (isBaseColumn(meta.column) && meta.column.sorter !== undefined) {
    handleSorterClick(meta.column)
  }
}

function sorterClasses(column: DataTableColumn): Array<string | false> {
  const order = currentSortOrder(column)
  return [
    'sn-data-table__sorter',
    order === 'ascend' ? 'sn-data-table__sorter--asc' : false,
    order === 'descend' ? 'sn-data-table__sorter--desc' : false,
    order !== false ? 'sn-data-table__sorter--active' : false,
  ]
}

/* ------------------------------------------------------------------ */
/* Pagination (simplified built-in bar; AUI-WEB-DATA-008 future marker) */
/* ------------------------------------------------------------------ */

const paginationConfig = computed<DataTablePagination | null>(() =>
  props.pagination === false ? null : props.pagination,
)

const uncontrolledPage = ref<number>(
  props.pagination !== false ? (props.pagination?.defaultPage ?? 1) : 1,
)
const uncontrolledPageSize = ref<number>(
  props.pagination !== false
    ? (props.pagination?.defaultPageSize ?? props.pagination?.pageSize ?? 10)
    : 10,
)

const mergedPageSize = computed<number>(
  () => paginationConfig.value?.pageSize ?? uncontrolledPageSize.value,
)

const itemCount = computed<number>(
  () => paginationConfig.value?.itemCount ?? filteredData.value.length,
)

const pageCount = computed<number>(() => {
  const explicit = paginationConfig.value?.pageCount
  if (explicit !== undefined) return Math.max(1, explicit)
  return Math.max(1, Math.ceil(itemCount.value / mergedPageSize.value))
})

const mergedPage = computed<number>(() => {
  const page = paginationConfig.value?.page ?? uncontrolledPage.value
  return Math.max(1, Math.min(pageCount.value, page))
})

const paginatedData = computed<DataTableRowData[]>(() => {
  if (paginationConfig.value === null) return sortedData.value
  const start = (mergedPage.value - 1) * mergedPageSize.value
  return sortedData.value.slice(start, start + mergedPageSize.value)
})

const pageWindow = computed<number[]>(() => {
  const total = pageCount.value
  const current = mergedPage.value
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  const pages: number[] = []
  for (let page = start; page <= end; page += 1) pages.push(page)
  return pages
})

const pageSizeOptions = computed<number[]>(() => {
  const sizes = paginationConfig.value?.pageSizes
  if (sizes !== undefined && sizes.length > 0) return sizes
  return [mergedPageSize.value]
})

function handlePageChange(page: number): void {
  if (props.loading) return
  const clamped = Math.max(1, Math.min(pageCount.value, page))
  if (clamped === mergedPage.value) return
  paginationConfig.value?.onChange?.(clamped)
  emit('update:page', clamped)
  uncontrolledPage.value = clamped
}

function handlePageSizeChange(pageSize: number): void {
  if (props.loading) return
  paginationConfig.value?.onUpdatePageSize?.(pageSize)
  emit('update:pageSize', pageSize)
  uncontrolledPageSize.value = pageSize
}

function handlePageSizeSelect(event: Event): void {
  const target = event.target as HTMLSelectElement
  const size = Number.parseInt(target.value, 10)
  if (!Number.isNaN(size)) handlePageSizeChange(size)
}

/* ------------------------------------------------------------------ */
/* Row keys / selection                                                 */
/* ------------------------------------------------------------------ */

function getRowKey(row: DataTableRowData): DataTableRowKey {
  if (props.rowKey !== undefined) return props.rowKey(row)
  const key = row.key
  if (typeof key === 'string' || typeof key === 'number') return key
  return ''
}

const dataRowMap = computed<Map<DataTableRowKey, DataTableRowData>>(() => {
  const map = new Map<DataTableRowKey, DataTableRowData>()
  for (const row of props.data) map.set(getRowKey(row), row)
  return map
})

const selectionColumn = computed<DataTableSelectionColumn | null>(() => {
  for (const col of props.columns) {
    if (isSelectionColumn(col)) return col
  }
  return null
})

const isMultipleSelection = computed<boolean>(
  () => selectionColumn.value?.multiple !== false,
)

const uncontrolledCheckedKeys = ref<DataTableRowKey[]>([
  ...props.defaultCheckedRowKeys,
])

const mergedCheckedKeys = computed<DataTableRowKey[]>(() => {
  const source = props.checkedRowKeys ?? uncontrolledCheckedKeys.value
  if (!isMultipleSelection.value) return source.slice(0, 1)
  return source
})

const checkedKeySet = computed<Set<DataTableRowKey>>(
  () => new Set(mergedCheckedKeys.value),
)

const selectablePageRows = computed<DataTableRowData[]>(() =>
  paginatedData.value.filter(
    (row) => selectionColumn.value?.disabled?.(row) !== true,
  ),
)

const countPageChecked = computed<number>(
  () =>
    selectablePageRows.value.filter((row) =>
      checkedKeySet.value.has(getRowKey(row)),
    ).length,
)

const allRowsChecked = computed<boolean>(
  () =>
    selectablePageRows.value.length > 0
    && countPageChecked.value === selectablePageRows.value.length,
)

const someRowsChecked = computed<boolean>(
  () =>
    countPageChecked.value > 0
    && countPageChecked.value < selectablePageRows.value.length,
)

function emitChecked(
  keys: DataTableRowKey[],
  row: DataTableRowData | undefined,
  action: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll',
): void {
  const rowMap = dataRowMap.value
  const rows: DataTableRowData[] = []
  for (const key of keys) {
    const found = rowMap.get(key)
    if (found !== undefined) rows.push(found)
  }
  emit('update:checkedRowKeys', keys, rows, { row, action })
  uncontrolledCheckedKeys.value = keys
}

function isRowChecked(row: DataTableRowData): boolean {
  return checkedKeySet.value.has(getRowKey(row))
}

function isRowCheckDisabled(row: DataTableRowData): boolean {
  return selectionColumn.value?.disabled?.(row) === true || props.loading
}

function handleRowCheck(row: DataTableRowData): void {
  const col = selectionColumn.value
  if (col === null || props.loading) return
  if (col.disabled?.(row) === true) return
  const key = getRowKey(row)
  if (checkedKeySet.value.has(key)) {
    emitChecked(
      mergedCheckedKeys.value.filter((existing) => existing !== key),
      row,
      'uncheck',
    )
  } else if (isMultipleSelection.value) {
    emitChecked([...mergedCheckedKeys.value, key], row, 'check')
  } else {
    emitChecked([key], row, 'check')
  }
}

function handleCheckAll(): void {
  const col = selectionColumn.value
  if (col === null || props.loading) return
  const pageKeys = selectablePageRows.value.map((row) => getRowKey(row))
  if (allRowsChecked.value) {
    const removeSet = new Set(pageKeys)
    emitChecked(
      mergedCheckedKeys.value.filter((key) => !removeSet.has(key)),
      undefined,
      'uncheckAll',
    )
  } else {
    const merged = new Set(mergedCheckedKeys.value)
    for (const key of pageKeys) merged.add(key)
    emitChecked([...merged], undefined, 'checkAll')
  }
}

/* ------------------------------------------------------------------ */
/* Expand                                                               */
/* ------------------------------------------------------------------ */

const expandColumn = computed<DataTableExpandColumn | null>(() => {
  for (const col of props.columns) {
    if (isExpandColumn(col)) return col
  }
  return null
})

const uncontrolledExpandedKeys = ref<DataTableRowKey[]>([
  ...props.defaultExpandedRowKeys,
])

const mergedExpandedKeys = computed<DataTableRowKey[]>(
  () => props.expandedRowKeys ?? uncontrolledExpandedKeys.value,
)

const expandedKeySet = computed<Set<DataTableRowKey>>(
  () => new Set(mergedExpandedKeys.value),
)

function isRowExpanded(row: DataTableRowData): boolean {
  return expandedKeySet.value.has(getRowKey(row))
}

function rowExpandable(row: DataTableRowData): boolean {
  const col = expandColumn.value
  if (col === null) return false
  if (col.expandable !== undefined) return col.expandable(row)
  return true
}

function toggleExpand(row: DataTableRowData): void {
  if (props.loading) return
  if (!rowExpandable(row)) return
  const key = getRowKey(row)
  const next = isRowExpanded(row)
    ? mergedExpandedKeys.value.filter((existing) => existing !== key)
    : [...mergedExpandedKeys.value, key]
  emit('update:expandedRowKeys', next)
  uncontrolledExpandedKeys.value = next
}

/* ------------------------------------------------------------------ */
/* Summary                                                              */
/* ------------------------------------------------------------------ */

interface SummaryCellView {
  key: string
  colSpan: number | undefined
  content: VNodeChild
}

interface SummaryRowView {
  key: string
  cells: SummaryCellView[]
  isLast: boolean
}

const summaryRowViews = computed<SummaryRowView[]>(() => {
  const createSummary = props.summary
  if (createSummary === undefined) return []
  const result = createSummary(paginatedData.value)
  const list: DataTableSummaryRow[]
    = Array.isArray(result) ? result : [result]
  return list.map((record, rowIndex) => ({
    key: `summary-${rowIndex}`,
    cells: Object.entries(record).map(([columnKey, cell]) => ({
      key: String(columnKey),
      colSpan: cell?.colSpan,
      content: cell?.value ?? null,
    })),
    isLast: false,
  }))
})

const summaryRowsTop = computed<SummaryRowView[]>(() =>
  props.summaryPlacement === 'top' ? summaryRowViews.value : [],
)

const summaryRowsBottom = computed<SummaryRowView[]>(() => {
  if (props.summaryPlacement !== 'bottom') return []
  const rows = summaryRowViews.value
  return rows.map((row, index) => ({
    ...row,
    isLast: index === rows.length - 1,
  }))
})

/* ------------------------------------------------------------------ */
/* Display rows (data rows + interleaved expand rows)                   */
/* ------------------------------------------------------------------ */

interface DisplayRowItem {
  kind: 'row'
  key: string
  row: DataTableRowData
  rowIndex: number
  isLast: boolean
}

interface DisplayExpandItem {
  kind: 'expand'
  key: string
  row: DataTableRowData
  rowIndex: number
  isLast: boolean
}

type DisplayItem = DisplayRowItem | DisplayExpandItem

const displayItems = computed<DisplayItem[]>(() => {
  const rows = paginatedData.value
  const items: DisplayItem[] = []
  rows.forEach((row, rowIndex) => {
    const key = String(getRowKey(row))
    const isLastRow
      = summaryRowsBottom.value.length === 0
        && rowIndex === rows.length - 1
    if (isRowExpanded(row) && rowExpandable(row)) {
      items.push({ kind: 'row', key, row, rowIndex, isLast: false })
      items.push({
        kind: 'expand',
        key: `${key}-expand`,
        row,
        rowIndex,
        isLast: isLastRow,
      })
    } else {
      items.push({ kind: 'row', key, row, rowIndex, isLast: isLastRow })
    }
  })
  return items
})

function rowClassFor(item: DisplayRowItem): string {
  if (typeof props.rowClassName === 'function') {
    return props.rowClassName(item.row, item.rowIndex)
  }
  return props.rowClassName ?? ''
}

function rowPropsFor(item: DisplayRowItem): HTMLAttributes {
  return props.rowProps?.(item.row, item.rowIndex) ?? {}
}

/* ------------------------------------------------------------------ */
/* Cell rendering helpers (narrow the column union for the template)    */
/* ------------------------------------------------------------------ */

function cellWidthStyle(column: DataTableColumn): Record<string, string> {
  const style: Record<string, string> = {}
  const defaultWidth
    = isSelectionColumn(column) || isExpandColumn(column)
      ? SELECTION_COL_WIDTH
      : undefined
  const width = column.width ?? defaultWidth
  if (width !== undefined) {
    style.width = cssLen(width)
    style.minWidth = cssLen(column.minWidth ?? width)
  } else if (column.minWidth !== undefined) {
    style.minWidth = cssLen(column.minWidth)
  }
  if (column.maxWidth !== undefined) style.maxWidth = cssLen(column.maxWidth)
  return style
}

function thStyle(meta: DataTableColumnMeta): Record<string, string> {
  const style = cellWidthStyle(meta.column)
  const align = meta.column.titleAlign ?? meta.column.align
  if (align !== undefined) style.textAlign = align
  if (meta.isFixedLeft) style.left = `${meta.leftOffset}px`
  if (meta.isFixedRight) style.right = `${meta.rightOffset}px`
  return style
}

function tdStyle(meta: DataTableColumnMeta): Record<string, string> {
  const style = cellWidthStyle(meta.column)
  if (meta.column.align !== undefined) style.textAlign = meta.column.align
  if (meta.isFixedLeft) style.left = `${meta.leftOffset}px`
  if (meta.isFixedRight) style.right = `${meta.rightOffset}px`
  return style
}

function thClasses(meta: DataTableColumnMeta): Array<string | Record<string, boolean>> {
  const col = meta.column
  return [
    {
      'sn-data-table__th--selection': col.type === 'selection',
      'sn-data-table__th--expand': col.type === 'expand',
      'sn-data-table__th--sortable': isColumnSortable(col),
      'sn-data-table__th--sorting': isColumnSorting(col),
      'sn-data-table__th--filterable': isColumnFilterable(col),
      'sn-data-table__th--filter-open': isFilterOpenOn(meta),
      'sn-data-table__th--fixed-left': meta.isFixedLeft,
      'sn-data-table__th--fixed-right': meta.isFixedRight,
    },
    col.className ?? '',
  ]
}

function tdClasses(meta: DataTableColumnMeta, item: DisplayRowItem): Array<string | Record<string, boolean>> {
  const col = meta.column
  return [
    {
      'sn-data-table__td--selection': col.type === 'selection',
      'sn-data-table__td--expand': col.type === 'expand',
      'sn-data-table__td--index': col.type === 'index',
      'sn-data-table__td--sorting': isColumnSorting(col),
      'sn-data-table__td--ellipsis': isBaseColumn(col) && col.ellipsis === true,
      'sn-data-table__td--fixed-left': meta.isFixedLeft,
      'sn-data-table__td--fixed-right': meta.isFixedRight,
      'sn-data-table__td--last-row': item.isLast,
    },
    col.className ?? '',
  ]
}

function tdRenderContent(
  column: DataTableColumn,
  item: DisplayRowItem,
): VNodeChild {
  if (!isBaseColumn(column)) return null
  if (column.render === undefined) return null
  return column.render(item.row, item.rowIndex)
}

function tdText(column: DataTableColumn, row: DataTableRowData): string {
  if (!isBaseColumn(column)) return ''
  const value = row[column.key]
  if (value === null || value === undefined) return ''
  return String(value)
}

function ellipsisTitle(
  column: DataTableColumn,
  row: DataTableRowData,
): string | undefined {
  if (!isBaseColumn(column) || column.ellipsis !== true) return undefined
  return tdText(column, row)
}

function columnTitle(column: DataTableColumn): VNodeChild {
  if (isBaseColumn(column)) {
    return typeof column.title === 'function'
      ? column.title(column)
      : (column.title ?? null)
  }
  if (isExpandColumn(column)) {
    return typeof column.title === 'function'
      ? column.title(column)
      : (column.title ?? null)
  }
  if (column.type === 'index') return column.title ?? '#'
  return null
}

/* ------------------------------------------------------------------ */
/* Filter menu (inline panel; outside click closes)                     */
/* ------------------------------------------------------------------ */

const filterMenuKey = ref<string | null>(null)
const tempFilterValues = ref<Array<string | number>>([])
const tempFilterSingle = ref<string | number | null>(null)

const filterMenuColumn = computed<DataTableBaseColumn | null>(() => {
  if (filterMenuKey.value === null) return null
  for (const col of props.columns) {
    if (isBaseColumn(col) && String(col.key) === filterMenuKey.value) return col
  }
  return null
})

const filterMenuMultiple = computed<boolean>(
  () => filterMenuColumn.value?.filterMultiple !== false,
)

const filterMenuOptions = computed<DataTableFilterOption[]>(
  () => filterMenuColumn.value?.filterOptions ?? [],
)

function isColumnFilterable(column: DataTableColumn): boolean {
  if (!isBaseColumn(column)) return false
  return !!column.filter && (column.filterOptions?.length ?? 0) > 0
}

function isFilterOpenOn(meta: DataTableColumnMeta): boolean {
  return filterMenuKey.value !== null && filterMenuKey.value === meta.key
}

function isFilterActive(column: DataTableColumn): boolean {
  if (!isBaseColumn(column)) return false
  const active = mergedFilterState.value[column.key]
  if (active == null) return false
  return Array.isArray(active) ? active.length > 0 : true
}

function toggleFilterMenu(column: DataTableColumn): void {
  if (!isBaseColumn(column)) return
  const key = String(column.key)
  if (filterMenuKey.value === key) {
    filterMenuKey.value = null
    return
  }
  filterMenuKey.value = key
  const current = mergedFilterState.value[column.key]
  if (column.filterMultiple === false) {
    tempFilterSingle.value
      = typeof current === 'string' || typeof current === 'number'
        ? current
        : null
  } else {
    tempFilterValues.value = Array.isArray(current) ? [...current] : []
  }
}

function toggleTempFilterValue(value: string | number): void {
  if (tempFilterValues.value.includes(value)) {
    tempFilterValues.value = tempFilterValues.value.filter(
      (existing) => existing !== value,
    )
  } else {
    tempFilterValues.value = [...tempFilterValues.value, value]
  }
}

function chooseTempFilterValue(value: string | number): void {
  tempFilterSingle.value = value
  commitFilterState(value)
}

function confirmFilterMenu(): void {
  const column = filterMenuColumn.value
  if (column === null) return
  if (filterMenuMultiple.value) {
    commitFilterState([...tempFilterValues.value])
  } else {
    commitFilterState(tempFilterSingle.value)
  }
}

function resetFilterMenu(): void {
  const column = filterMenuColumn.value
  if (column === null) return
  commitFilterState(filterMenuMultiple.value ? [] : null)
}

function commitFilterState(
  value: Array<string | number> | string | number | null,
): void {
  const column = filterMenuColumn.value
  if (column === null) return
  const nextState: DataTableFilterState = { ...mergedFilterState.value }
  nextState[column.key] = value
  emit('update:filters', nextState, column)
  uncontrolledFilterState.value = nextState
  filterMenuKey.value = null
}

function handleDocPointerDown(event: Event): void {
  if (filterMenuKey.value === null) return
  const target = event.target
  if (
    target instanceof Element
    && target.closest('.sn-data-table__filter-menu, .sn-data-table__filter') !== null
  ) {
    return
  }
  filterMenuKey.value = null
}

watch(filterMenuKey, (key) => {
  if (key !== null) {
    document.addEventListener('pointerdown', handleDocPointerDown)
  } else {
    document.removeEventListener('pointerdown', handleDocPointerDown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocPointerDown)
})

/* ------------------------------------------------------------------ */
/* Fixed-column scroll shadows                                          */
/* ------------------------------------------------------------------ */

const scrollRef = ref<HTMLElement | null>(null)
const scrollShadowState = ref<{ left: boolean, right: boolean }>({
  left: false,
  right: false,
})

function updateScrollShadow(): void {
  const el = scrollRef.value
  if (el === null || !hasFixedColumns.value) {
    scrollShadowState.value = { left: false, right: false }
    return
  }
  scrollShadowState.value = {
    left: el.scrollLeft > 0,
    right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
  }
}

function handleBodyScroll(): void {
  updateScrollShadow()
}

onMounted(updateScrollShadow)

watch(
  () => [paginatedData.value, props.scrollX],
  () => {
    void nextTick(updateScrollShadow)
  },
)

/* ------------------------------------------------------------------ */
/* Root classes / styles                                                */
/* ------------------------------------------------------------------ */

const mergedBordered = computed<boolean>(() =>
  props.bordered !== undefined ? props.bordered : true,
)

const mergedBottomBordered = computed<boolean>(() => {
  if (mergedBordered.value) return false
  if (props.bottomBordered !== undefined) return props.bottomBordered
  return true
})

const isEmptyData = computed<boolean>(() => paginatedData.value.length === 0)

const rootClasses = computed<Array<string | Record<string, boolean>>>(() => [
  `sn-data-table--${props.size}`,
  {
    'sn-data-table--bordered': mergedBordered.value,
    'sn-data-table--bottom-bordered': mergedBottomBordered.value,
    'sn-data-table--single-line': props.singleLine,
    'sn-data-table--single-column': props.singleColumn,
    'sn-data-table--loading': props.loading,
    'sn-data-table--empty': isEmptyData.value,
    'sn-data-table--scroll-x': props.scrollX !== undefined,
    'sn-data-table--shadow-left': scrollShadowState.value.left,
    'sn-data-table--shadow-right': scrollShadowState.value.right,
  },
])

const scrollStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.maxHeight !== undefined) {
    style.maxHeight = cssLen(props.maxHeight)
  }
  return style
})

const innerStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {}
  if (props.scrollX !== undefined) style.minWidth = cssLen(props.scrollX)
  return style
})
</script>

<template>
  <div
    data-snui-component="data-table"
    class="sn-data-table"
    :class="rootClasses"
  >
    <div
      ref="scrollRef"
      class="sn-data-table__scroll"
      :style="scrollStyle"
      @scroll="handleBodyScroll"
    >
      <div class="sn-data-table__inner" :style="innerStyle">
        <table
          class="sn-data-table__table"
          :style="{ tableLayout }"
        >
          <thead class="sn-data-table__thead">
            <tr class="sn-data-table__tr">
              <th
                v-for="meta in columnMetas"
                :key="meta.key"
                class="sn-data-table__th"
                :class="thClasses(meta)"
                :style="thStyle(meta)"
                @click="handleThClick(meta)"
              >
                <span
                  v-if="meta.column.type === 'selection' && isMultipleSelection"
                  class="sn-data-table__checkbox"
                  :class="{
                    'sn-data-table__checkbox--checked': allRowsChecked,
                    'sn-data-table__checkbox--indeterminate': someRowsChecked && !allRowsChecked,
                    'sn-data-table__checkbox--disabled': paginatedData.length === 0 || loading,
                  }"
                  role="checkbox"
                  :aria-checked="someRowsChecked && !allRowsChecked ? 'mixed' : allRowsChecked ? 'true' : 'false'"
                  :aria-disabled="paginatedData.length === 0 || loading ? 'true' : undefined"
                  tabindex="0"
                  @click.stop="handleCheckAll"
                  @keydown.enter.prevent="handleCheckAll"
                  @keydown.space.prevent="handleCheckAll"
                >
                  <svg
                    v-if="allRowsChecked"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  <svg
                    v-else-if="someRowsChecked"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 12h12" />
                  </svg>
                </span>
                <template v-else>
                  <span class="sn-data-table__th-title-wrapper">
                    <span class="sn-data-table__th-title">
                      <VNodeRenderer :content="columnTitle(meta.column)" />
                    </span>
                    <span
                      v-if="isColumnSortable(meta.column)"
                      class="sn-data-table__sorter"
                      :class="sorterClasses(meta.column)"
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    </span>
                  </span>
                  <button
                    v-if="isColumnFilterable(meta.column)"
                    type="button"
                    class="sn-data-table__filter"
                    :class="{
                      'sn-data-table__filter--active': isFilterActive(meta.column) || isFilterOpenOn(meta),
                    }"
                    aria-haspopup="true"
                    :aria-expanded="isFilterOpenOn(meta) ? 'true' : 'false'"
                    @click.stop="toggleFilterMenu(meta.column)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 3H2l8 9.46V19l4 2v-9.54L22 3z" />
                    </svg>
                  </button>
                  <div
                    v-if="isFilterOpenOn(meta)"
                    class="sn-data-table__filter-menu"
                    @click.stop
                  >
                    <div class="sn-data-table__filter-menu-options">
                      <template v-if="filterMenuMultiple">
                        <label
                          v-for="option in filterMenuOptions"
                          :key="String(option.value)"
                          class="sn-data-table__filter-option"
                          @click.stop="toggleTempFilterValue(option.value)"
                        >
                          <span
                            class="sn-data-table__checkbox"
                            :class="{
                              'sn-data-table__checkbox--checked': tempFilterValues.includes(option.value),
                            }"
                            role="checkbox"
                            :aria-checked="tempFilterValues.includes(option.value) ? 'true' : 'false'"
                          >
                            <svg
                              v-if="tempFilterValues.includes(option.value)"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              aria-hidden="true"
                            >
                              <path d="m5 12 5 5L20 7" />
                            </svg>
                          </span>
                          <span class="sn-data-table__filter-option-label">{{ option.label }}</span>
                        </label>
                      </template>
                      <template v-else>
                        <label
                          v-for="option in filterMenuOptions"
                          :key="String(option.value)"
                          class="sn-data-table__filter-option"
                          @click.stop="chooseTempFilterValue(option.value)"
                        >
                          <span
                            class="sn-data-table__radio"
                            :class="{
                              'sn-data-table__radio--checked': tempFilterSingle === option.value,
                            }"
                            role="radio"
                            :aria-checked="tempFilterSingle === option.value ? 'true' : 'false'"
                          />
                          <span class="sn-data-table__filter-option-label">{{ option.label }}</span>
                        </label>
                      </template>
                    </div>
                    <div v-if="filterMenuMultiple" class="sn-data-table__filter-actions">
                      <button
                        type="button"
                        class="sn-data-table__filter-action"
                        @click.stop="confirmFilterMenu"
                      >
                        确认
                      </button>
                      <button
                        type="button"
                        class="sn-data-table__filter-action"
                        @click.stop="resetFilterMenu"
                      >
                        重置
                      </button>
                    </div>
                  </div>
                </template>
              </th>
            </tr>
          </thead>
          <tbody class="sn-data-table__tbody">
            <tr
              v-for="summaryRow in summaryRowsTop"
              :key="summaryRow.key"
              class="sn-data-table__tr sn-data-table__tr--summary"
            >
              <td
                v-for="cell in summaryRow.cells"
                :key="cell.key"
                class="sn-data-table__td sn-data-table__td--summary"
                :colspan="cell.colSpan"
              >
                <VNodeRenderer :content="cell.content" />
              </td>
            </tr>
            <template v-for="item in displayItems" :key="item.key">
              <tr
                v-if="item.kind === 'row'"
                class="sn-data-table__tr"
                :class="[
                  item.rowIndex % 2 === 1 && striped ? 'sn-data-table__tr--striped' : '',
                  rowClassFor(item),
                ]"
                v-bind="rowPropsFor(item)"
              >
                <td
                  v-for="meta in columnMetas"
                  :key="meta.key"
                  class="sn-data-table__td"
                  :class="tdClasses(meta, item)"
                  :style="tdStyle(meta)"
                >
                  <span
                    v-if="meta.column.type === 'selection'"
                    class="sn-data-table__checkbox"
                    :class="{
                      'sn-data-table__checkbox--checked': isRowChecked(item.row),
                      'sn-data-table__checkbox--disabled': isRowCheckDisabled(item.row),
                    }"
                    role="checkbox"
                    :aria-checked="isRowChecked(item.row) ? 'true' : 'false'"
                    :aria-disabled="selectionColumn?.disabled?.(item.row) ? 'true' : undefined"
                    tabindex="0"
                    @click.stop="handleRowCheck(item.row)"
                    @keydown.enter.prevent="handleRowCheck(item.row)"
                    @keydown.space.prevent="handleRowCheck(item.row)"
                  >
                    <svg
                      v-if="isRowChecked(item.row)"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  <span
                    v-else-if="meta.column.type === 'expand' && rowExpandable(item.row)"
                    class="sn-data-table__expand-trigger"
                    :class="{
                      'sn-data-table__expand-trigger--expanded': isRowExpanded(item.row),
                    }"
                    role="button"
                    tabindex="0"
                    :aria-expanded="isRowExpanded(item.row) ? 'true' : 'false'"
                    @click.stop="toggleExpand(item.row)"
                    @keydown.enter.prevent.stop="toggleExpand(item.row)"
                    @keydown.space.prevent.stop="toggleExpand(item.row)"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                  <span
                    v-else-if="meta.column.type === 'expand'"
                    class="sn-data-table__expand-placeholder"
                    aria-hidden="true"
                  />
                  <span
                    v-else-if="meta.column.type === 'index'"
                    class="sn-data-table__index-cell"
                  >{{ item.rowIndex + 1 }}</span>
                  <template v-else>
                    <VNodeRenderer
                      v-if="tdRenderContent(meta.column, item) !== null"
                      :content="tdRenderContent(meta.column, item)"
                    />
                    <span
                      v-else-if="meta.column.ellipsis === true"
                      class="sn-data-table__ellipsis"
                      :title="ellipsisTitle(meta.column, item.row)"
                    >{{ tdText(meta.column, item.row) }}</span>
                    <template v-else>{{ tdText(meta.column, item.row) }}</template>
                  </template>
                </td>
              </tr>
              <tr
                v-else
                class="sn-data-table__tr sn-data-table__tr--expand-row"
              >
                <td
                  class="sn-data-table__td sn-data-table__td--expand-cell"
                  :class="{ 'sn-data-table__td--last-row': item.isLast }"
                  :colspan="columnMetas.length"
                >
                  <VNodeRenderer
                    :content="expandColumn?.renderExpand(item.row, item.rowIndex) ?? null"
                  />
                </td>
              </tr>
            </template>
            <tr
              v-if="isEmptyData && summaryRowsTop.length === 0"
              class="sn-data-table__tr sn-data-table__tr--empty"
            >
              <td
                class="sn-data-table__td sn-data-table__td--empty"
                :colspan="columnMetas.length"
              >
                <slot name="empty">
                  <div class="sn-data-table__empty">
                    <svg
                      class="sn-data-table__empty-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
                      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                    <span class="sn-data-table__empty-text">无数据</span>
                  </div>
                </slot>
              </td>
            </tr>
            <tr
              v-for="summaryRow in summaryRowsBottom"
              :key="summaryRow.key"
              class="sn-data-table__tr sn-data-table__tr--summary"
            >
              <td
                v-for="cell in summaryRow.cells"
                :key="cell.key"
                class="sn-data-table__td sn-data-table__td--summary"
                :class="{ 'sn-data-table__td--last-row': summaryRow.isLast }"
                :colspan="cell.colSpan"
              >
                <VNodeRenderer :content="cell.content" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="paginationConfig !== null" class="sn-data-table__pagination">
      <span class="sn-data-table__pagination-total">共 {{ itemCount }} 条</span>
      <button
        type="button"
        class="sn-data-table__pagination-item sn-data-table__pagination-arrow"
        :disabled="mergedPage <= 1 || loading"
        aria-label="上一页"
        @click="handlePageChange(mergedPage - 1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        v-for="page in pageWindow"
        :key="page"
        type="button"
        class="sn-data-table__pagination-item"
        :class="{ 'sn-data-table__pagination-item--active': page === mergedPage }"
        :disabled="loading"
        :aria-current="page === mergedPage ? 'page' : undefined"
        @click="handlePageChange(page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        class="sn-data-table__pagination-item sn-data-table__pagination-arrow"
        :disabled="mergedPage >= pageCount || loading"
        aria-label="下一页"
        @click="handlePageChange(mergedPage + 1)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
      <select
        v-if="paginationConfig.showSizePicker === true"
        class="sn-data-table__pagination-size"
        :value="mergedPageSize"
        :disabled="loading"
        aria-label="每页条数"
        @change="handlePageSizeSelect"
      >
        <option
          v-for="sizeOption in pageSizeOptions"
          :key="sizeOption"
          :value="sizeOption"
        >
          {{ sizeOption }} 条/页
        </option>
      </select>
    </div>
    <div v-if="loading" class="sn-data-table__loading" role="status">
      <svg viewBox="0 0 42 42" fill="none" aria-hidden="true">
        <circle
          cx="21"
          cy="21"
          r="16"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-dasharray="72"
          stroke-dashoffset="48"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * Dimensions follow naive-ui src/data-table/src/styles/index.cssr.ts +
 * styles/_common.ts: th/td padding 8/12/12px, sorter 15px, filter 36px
 * trigger / 15px glyph, empty padding 48px 0, pagination margin 12px 0 0,
 * radius 3px, line-height 1.6, tabular-nums.
 * Colors follow naive-ui light.ts over white: inner grid lines = divider
 * 6% ink (rgb(239,239,245)), outer frame / control outlines 12%
 * (rgb(224,224,230)), header bg 2% (#fafafc), row hover 3%
 * (rgba(0,0,100,.03)), striped 2% (rgba(0,0,100,.02)). The heavy
 * border-default / background-subtle semantic tiers caused the "thick
 * border" look and are no longer used here. */

.sn-data-table {
  /* Emphasized outline: outer frame, floating filter menu, control
   * borders (checkbox / radio / pagination) — one step above hairline. */
  --sn-dt-border-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 12%,
    var(--sn-web-color-background-surface)
  );
  /* Hairline: row / column separators inside the grid. */
  --sn-dt-divider-color: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 6%,
    var(--sn-web-color-background-surface)
  );
  --sn-dt-th-bg: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
  --sn-dt-hover-bg: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 3%,
    var(--sn-web-color-background-surface)
  );
  --sn-dt-striped-bg: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 2%,
    var(--sn-web-color-background-surface)
  );
  --sn-dt-th-text: var(--sn-web-color-text-primary);
  --sn-dt-td-text: var(--sn-web-color-text-secondary);
  --sn-dt-icon: var(--sn-web-color-text-tertiary);
  --sn-dt-icon-active: var(--sn-web-color-action-primary);
  --sn-dt-radius: 3px;
  --sn-dt-th-padding: 12px;
  --sn-dt-td-padding: 12px;

  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 14px;
  line-height: 1.6;
  font-variant-numeric: tabular-nums;
}

/* Host chrome (e.g. vitepress `.vp-doc table/tr`) must not leak in:
 * display:block kills width:100%, tr border-top doubles cell borders. */
.sn-data-table__table {
  display: table;
  margin: 0;
}

.sn-data-table__tr {
  border: none;
}

.sn-data-table--small {
  --sn-dt-th-padding: 8px;
  --sn-dt-td-padding: 8px;
}

.sn-data-table--large {
  font-size: 15px;
}

.sn-data-table__scroll {
  flex-grow: 1;
  overflow: auto;
  border-radius: var(--sn-dt-radius) var(--sn-dt-radius) 0 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table--bordered .sn-data-table__scroll {
  border: 1px solid var(--sn-dt-border-color);
  border-radius: var(--sn-dt-radius);
}

.sn-data-table__inner {
  position: relative;
  min-width: 100%;
}

.sn-data-table__table {
  width: 100%;
  word-break: break-word;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--sn-web-color-background-surface);
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ---------- Header ---------- */

.sn-data-table__thead {
  background-color: var(--sn-dt-th-bg);
}

.sn-data-table__th {
  position: sticky;
  top: 0;
  z-index: 1;
  box-sizing: border-box;
  padding: var(--sn-dt-th-padding);
  text-align: start;
  font-weight: 500;
  color: var(--sn-dt-th-text);
  background-color: var(--sn-dt-th-bg);
  /* Defensive reset, mirrors `__td`: host-global table chrome (e.g. a docs
   * site styling `.vp-doc th/td`) must not leak onto undeclared sides. */
  border: none;
  border-bottom: 1px solid var(--sn-dt-divider-color);
  transition:
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__th--sortable {
  cursor: pointer;
}

.sn-data-table__th--sortable:hover,
.sn-data-table__th--sorting {
  background-color: var(--sn-dt-hover-bg);
}

.sn-data-table__th--filterable {
  padding-right: 36px;
}

.sn-data-table__th--filterable.sn-data-table__th--sortable {
  padding-right: calc(var(--sn-dt-th-padding) + 36px);
}

.sn-data-table__th--selection,
.sn-data-table__th--expand {
  padding: 0;
  text-align: center;
  line-height: 0;
}

.sn-data-table__th--selection {
  z-index: 3;
}

.sn-data-table__th--fixed-left,
.sn-data-table__th--fixed-right {
  z-index: 2;
}

.sn-data-table__th--filter-open {
  z-index: 30;
}

.sn-data-table__th-title-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  max-width: 100%;
}

.sn-data-table__th-title {
  flex: 1;
  min-width: 0;
}

/* ---------- Sorter (naive single rotating arrow) ---------- */

.sn-data-table__sorter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  margin-left: 4px;
  vertical-align: -0.2em;
  color: var(--sn-dt-icon);
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__sorter svg {
  width: 15px;
  height: 15px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__sorter--asc svg {
  transform: rotate(-180deg);
}

.sn-data-table__sorter--active {
  color: var(--sn-dt-icon-active);
}

/* ---------- Filter ---------- */

.sn-data-table__filter {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  padding: 0;
  border: none;
  font-size: 15px;
  color: var(--sn-dt-icon);
  background: transparent;
  cursor: pointer;
  transition:
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__filter svg {
  width: 15px;
  height: 15px;
}

.sn-data-table__filter:hover,
.sn-data-table__filter--active {
  background-color: var(--sn-dt-hover-bg);
}

.sn-data-table__filter--active {
  color: var(--sn-dt-icon-active);
}

.sn-data-table__filter-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 30;
  min-width: 140px;
  background-color: var(--sn-web-color-background-elevated);
  border: 1px solid var(--sn-dt-border-color);
  border-radius: var(--sn-dt-radius);
  box-shadow: var(--sn-web-card-shadow);
}

.sn-data-table__filter-menu-options {
  display: flex;
  flex-direction: column;
  max-height: 240px;
  padding: 12px 12px 0;
  overflow: auto;
}

.sn-data-table__filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sn-dt-td-text);
  cursor: pointer;
}

.sn-data-table__filter-option-label {
  flex: 1;
  min-width: 0;
}

.sn-data-table__filter-actions {
  display: flex;
  justify-content: space-evenly;
  padding: 8px 12px;
  border-top: 1px solid var(--sn-dt-divider-color);
}

.sn-data-table__filter-action {
  padding: 0 4px;
  border: none;
  font-size: 14px;
  line-height: 28px;
  color: var(--sn-web-color-action-primary);
  background: transparent;
  cursor: pointer;
}

.sn-data-table__filter-action:hover {
  color: var(--sn-web-color-action-primary-hover);
}

/* ---------- Checkbox / radio (custom span + svg, n-checkbox visual) ---------- */

.sn-data-table__checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  border: 1px solid var(--sn-dt-border-color);
  border-radius: 3px;
  color: var(--sn-web-color-text-on-primary);
  background-color: var(--sn-web-color-background-surface);
  cursor: pointer;
  transition:
    background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__checkbox svg {
  width: 10px;
  height: 10px;
  opacity: 0;
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__checkbox--checked {
  background-color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}

.sn-data-table__checkbox--checked svg {
  opacity: 1;
}

.sn-data-table__checkbox--indeterminate {
  border-color: var(--sn-web-color-action-primary);
}

.sn-data-table__checkbox--indeterminate svg {
  color: var(--sn-web-color-action-primary);
  opacity: 1;
}

.sn-data-table__checkbox--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sn-data-table__checkbox:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 1px;
}

.sn-data-table__radio {
  position: relative;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  border: 1px solid var(--sn-dt-border-color);
  border-radius: 50%;
  background-color: var(--sn-web-color-background-surface);
  transition: border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__radio--checked {
  border-color: var(--sn-web-color-action-primary);
}

.sn-data-table__radio--checked::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: 50%;
  background-color: var(--sn-web-color-action-primary);
}

/* ---------- Body ---------- */

.sn-data-table__tr {
  position: relative;
  box-sizing: border-box;
  background-clip: padding-box;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__tr--striped,
.sn-data-table__tr--striped .sn-data-table__td {
  background-color: var(--sn-dt-striped-bg);
}

.sn-data-table__tr:not(.sn-data-table__tr--summary):not(.sn-data-table__tr--empty):hover .sn-data-table__td {
  background-color: var(--sn-dt-hover-bg);
}

.sn-data-table__td {
  box-sizing: border-box;
  padding: var(--sn-dt-td-padding);
  text-align: start;
  color: var(--sn-dt-td-text);
  background-color: var(--sn-web-color-background-surface);
  border: none;
  border-bottom: 1px solid var(--sn-dt-divider-color);
  transition:
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__td--selection,
.sn-data-table__td--expand,
.sn-data-table__td--index {
  padding: 0;
  text-align: center;
  line-height: 0;
}

.sn-data-table__td--sorting {
  background-color: var(--sn-dt-hover-bg);
}

.sn-data-table__td--summary {
  background-color: var(--sn-dt-th-bg);
}

.sn-data-table__td--last-row {
  border-bottom: 0 solid var(--sn-dt-divider-color);
}

.sn-data-table--bottom-bordered .sn-data-table__td--last-row {
  border-bottom: 1px solid var(--sn-dt-divider-color);
}

.sn-data-table__td--expand-cell {
  padding: var(--sn-dt-td-padding);
  text-align: start;
  line-height: 1.6;
}

.sn-data-table__td--empty {
  padding: 0;
  text-align: center;
  border-bottom: 0;
}

.sn-data-table__td--fixed-left,
.sn-data-table__td--fixed-right {
  position: sticky;
  z-index: 2;
}

.sn-data-table__ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  vertical-align: bottom;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Expand ---------- */

.sn-data-table__expand-trigger {
  position: relative;
  display: inline-flex;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: var(--sn-dt-td-text);
  cursor: pointer;
  vertical-align: -0.2em;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__expand-trigger svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__expand-trigger--expanded svg {
  transform: rotate(90deg);
}

.sn-data-table__expand-trigger:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 1px;
}

.sn-data-table__expand-placeholder {
  display: inline-block;
  width: 16px;
  height: 1px;
  margin-right: 8px;
}

/* ---------- Empty ---------- */

.sn-data-table__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 0;
  color: var(--sn-web-color-text-tertiary);
}

.sn-data-table__empty-icon {
  width: 48px;
  height: 48px;
}

.sn-data-table__empty-text {
  font-size: 14px;
}

/* ---------- Fixed-column scroll shadows ---------- */

.sn-data-table--shadow-left .sn-data-table__th--fixed-left::after,
.sn-data-table--shadow-left .sn-data-table__td--fixed-left::after {
  content: '';
  position: absolute;
  top: 0;
  right: -36px;
  bottom: -1px;
  width: 36px;
  pointer-events: none;
  box-shadow: inset -12px 0 8px -12px
    color-mix(in srgb, var(--sn-web-color-background-overlay) 40%, transparent);
}

.sn-data-table--shadow-right .sn-data-table__th--fixed-right::before,
.sn-data-table--shadow-right .sn-data-table__td--fixed-right::before {
  content: '';
  position: absolute;
  top: 0;
  left: -36px;
  bottom: -1px;
  width: 36px;
  pointer-events: none;
  box-shadow: inset 12px 0 8px -12px
    color-mix(in srgb, var(--sn-web-color-background-overlay) 40%, transparent);
}

/* ---------- Separators ---------- */

.sn-data-table:not(.sn-data-table--single-line) .sn-data-table__th,
.sn-data-table:not(.sn-data-table--single-line) .sn-data-table__td {
  border-right: 1px solid var(--sn-dt-divider-color);
}

.sn-data-table:not(.sn-data-table--single-line) .sn-data-table__th:last-child,
.sn-data-table:not(.sn-data-table--single-line) .sn-data-table__td:last-child {
  border-right: 0;
}

.sn-data-table--single-column .sn-data-table__td {
  border-bottom: 0 solid var(--sn-dt-divider-color);
}

.sn-data-table--single-column.sn-data-table--bottom-bordered .sn-data-table__td--last-row {
  border-bottom: 1px solid var(--sn-dt-divider-color);
}

/* ---------- Loading ---------- */

.sn-data-table--loading .sn-data-table__scroll {
  opacity: 0.5;
  pointer-events: none;
}

.sn-data-table__loading {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sn-web-color-action-primary);
  transform: translateX(-50%) translateY(-50%);
}

.sn-data-table__loading svg {
  width: 28px;
  height: 28px;
  animation: sn-data-table-spin 1.2s linear infinite;
}

@keyframes sn-data-table-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* ---------- Simplified pagination bar ---------- */

.sn-data-table__pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin: 12px 0 0;
}

.sn-data-table__pagination-total {
  font-size: 14px;
  color: var(--sn-dt-td-text);
}

.sn-data-table__pagination-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  font-size: 14px;
  color: var(--sn-dt-td-text);
  background-color: var(--sn-web-color-background-surface);
  border: 1px solid var(--sn-dt-border-color);
  border-radius: var(--sn-dt-radius);
  cursor: pointer;
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sn-data-table__pagination-item svg {
  width: 14px;
  height: 14px;
}

.sn-data-table__pagination-item:hover:enabled {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}

.sn-data-table__pagination-item--active {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
  background-color: color-mix(
    in srgb,
    var(--sn-web-color-action-primary) 10%,
    var(--sn-web-color-background-surface)
  );
  cursor: default;
}

.sn-data-table__pagination-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sn-data-table__pagination-size {
  height: 28px;
  padding: 0 4px;
  font-size: 14px;
  color: var(--sn-dt-td-text);
  background-color: var(--sn-web-color-background-surface);
  border: 1px solid var(--sn-dt-border-color);
  border-radius: var(--sn-dt-radius);
}
</style>
