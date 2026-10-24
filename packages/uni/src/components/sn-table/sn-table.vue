<script setup lang="ts">
/**
 * sn-table (uni-end) — data table with header / stripe / index / sort / fixed column.
 *
 * Reference library: wot-ui `wd-table`
 *   (https://wot-ui.cn/component/table.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-table 1:1 except for
 * the documented omissions. Anything new added here MUST also be added to the
 * reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-table/sn-table.vue
 * → auto-registered as `<sn-table>` in any .vue that uses it.
 *
 * ## Parent / child, not a `columns` array
 *
 * wd-table splits its surface across `wd-table` + `wd-table-column`, and the
 * spec's `desc` column names the child's props (`prop` / `label` / `width` /
 * `sortable` / `fixed` / `align`). This component keeps that shape:
 * `sn-table-column` children register through provide/inject (the `sn-tabs` /
 * `sn-sidebar` layout), so column order is DOM order and each column owns its
 * `value` slot.
 *
 * ## Scrolling
 *
 * A `<scroll-view scroll-x>` wraps the grid, so a table wider than the phone
 * scrolls horizontally. `height` turns the vertical scroller on and
 * `fixed-header` pins the header row inside it (`position: sticky`). Nothing is
 * measured in JS — no `createSelectorQuery`, no listener, nothing to dispose.
 *
 * A column with `fixed` is pinned to the left edge by cumulative `left`
 * offsets, which this component already knows from its own width bookkeeping.
 *
 * ## Documented omissions (CONTRIBUTING §2.2 — no half-built props)
 *
 *   - `virtual` / `row-height` / `buffer` are NOT declared. A reliable virtual
 *     scroller needs `scroll-top` plus per-row height measurement, and
 *     `scroll-view` reports scroll offsets inconsistently between WeChat /
 *     Alipay / H5. Rendering every row keeps behaviour identical on all
 *     targets; combine `height` + `fixed-header` for long datasets.
 *   - `span-method` is NOT declared: cross-end `rowspan` / `colspan` inside a
 *     `<scroll-view>` breaks the fixed-column offsets computed above.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only. It
 * never reorders `data`: `sort-method` reports the column and the order the
 * user asked for, and the host decides how to sort its rows.
 *
 * Usage:
 *   <sn-table :data="rows" border stripe>
 *     <sn-table-column prop="name" label="名称" />
 *     <sn-table-column prop="amount" label="金额" align="right" sortable />
 *   </sn-table>
 *
 * Not responsible for:
 *   - 分页 — 用 sn-pagination
 *   - 加载态 — 用 sn-loading / sn-skeleton
 *   - 空态插画 — 用 sn-empty（本组件只渲染一行内置空态）
 */

import { computed, provide, ref, useSlots } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import { ChevronDown, ChevronUp } from '../sn-icon/sn-icon-set'
import {
  SN_TABLE_KEY,
  type SnTableAlign,
  type SnTableColumn,
  type SnTableColumnEntry,
  type SnTableIndexConfig,
  type SnTableRow,
  type SnTableSortOrder,
} from './sn-table-types'

defineOptions({ name: 'SnTable' })

/** Default column width in design px (mirrors `wd-table-column` `width`). */
const DEFAULT_COLUMN_WIDTH = 100

/** Design px → rpx (750 design width, 1px = 2rpx — CONTRIBUTING §2.4). */
const RPX_PER_PX = 2

const props = withDefaults(
  defineProps<{
    /** Table rows. */
    data?: SnTableRow[]
    /** Draw cell borders. */
    border?: boolean
    /** Zebra-stripe the body rows. */
    stripe?: boolean
    /** Max height — a bare number is design px. Setting it turns on vertical scrolling. */
    height?: string | number | undefined
    /** Render the header row. */
    showHeader?: boolean
    /** Clamp cell text to two lines. */
    ellipsis?: boolean
    /** Show the index column; an object customises its label / width / align. */
    index?: boolean | SnTableIndexConfig
    /** Pin the header row while the body scrolls vertically. */
    fixedHeader?: boolean
    /** Custom class for the root node. */
    customClass?: string
    /** Custom inline style for the root node. */
    customStyle?: string
  }>(),
  {
    data: () => [],
    border: true,
    stripe: true,
    height: undefined,
    showHeader: true,
    ellipsis: false,
    index: false,
    fixedHeader: true,
    customClass: '',
    customStyle: '',
  },
)

defineSlots<{
  /** Column definitions (`sn-table-column` children). */
  default?(): unknown
  /** Replaces the built-in empty row when the table has no rows. */
  empty?(): unknown
}>()

const emit = defineEmits<{
  (e: 'sort-method', column: { prop: string; label: string; order: SnTableSortOrder }): void
  (e: 'row-click', payload: { rowIndex: number; row: SnTableRow }): void
}>()

/* ── Column registration (provide / inject) ─────────────────────────────── */

const columns = ref<SnTableColumnEntry[]>([])

function registerColumn(entry: SnTableColumnEntry): void {
  columns.value = [...columns.value, entry]
}

function unregisterColumn(uid: number): void {
  columns.value = columns.value.filter((entry) => entry.uid !== uid)
}

/**
 * Cycle `none → asc → desc → none` on the tapped column and report it.
 *
 * The component never reorders `data` itself (AGENTS.md §32).
 */
function toggleSort(uid: number): void {
  const entry = columns.value.find((column) => column.uid === uid)
  if (!entry) return
  const current = entry.getColumn().sortOrder
  const next: SnTableSortOrder = current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none'
  entry.setSortOrder(next)
  const column = entry.getColumn()
  emit('sort-method', { prop: column.prop, label: column.label, order: next })
}

provide(SN_TABLE_KEY, { columns, registerColumn, unregisterColumn, toggleSort })

/* ── Layout resolution ─────────────────────────────────────────────────── */

const slots = useSlots()

/** Whether the index column is rendered. */
const showsIndex = computed(() => props.index !== false)

/** Resolved index-column config (label / width / align). */
const indexConfig = computed<Required<SnTableIndexConfig>>(() => {
  const raw = typeof props.index === 'object' && props.index !== null ? props.index : {}
  return {
    label: raw.label ?? '',
    width: raw.width ?? DEFAULT_COLUMN_WIDTH,
    align: raw.align ?? 'center',
  }
})

/** Resolve a numeric-or-string length (bare number = design px → rpx). */
function toLength(value: string | number | undefined): string {
  if (value === undefined || value === '') return `${DEFAULT_COLUMN_WIDTH * RPX_PER_PX}rpx`
  return typeof value === 'number' ? `${value * RPX_PER_PX}rpx` : value
}

/** A column with its resolved CSS width and sticky offset. */
interface ResolvedColumn extends SnTableColumn {
  /** Resolved CSS width. */
  cssWidth: string
  /** Cumulative left offset when pinned, `''` otherwise. */
  stickyLeft: string
}

/** Columns resolved left-to-right, with sticky offsets for pinned ones. */
const resolvedColumns = computed<ResolvedColumn[]>(() => {
  // The index column occupies the leftmost slot; pinned columns start after it.
  let offsetPx = showsIndex.value
    ? toLength(indexConfig.value.width)
    : '0px'
  return columns.value.map((entry) => {
    const column = entry.getColumn()
    const cssWidth = toLength(column.width)
    const stickyLeft = column.fixed ? offsetPx : ''
    if (column.fixed) offsetPx = `calc(${offsetPx} + ${cssWidth})`
    return { ...column, cssWidth, stickyLeft }
  })
})

/** Map `prop → column uid`, so a header tap does not re-scan the list. */
const columnUids = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {}
  for (const entry of columns.value) map[entry.getColumn().prop] = entry.uid
  return map
})

/** Map `prop → custom cell renderer` declared through a column's `value` slot. */
const cellRenderers = computed<Record<string, ((props: { row: SnTableRow; index: number }) => unknown) | undefined>>(() => {
  const map: Record<string, ((props: { row: SnTableRow; index: number }) => unknown) | undefined> = {}
  for (const entry of columns.value) map[entry.getColumn().prop] = entry.getValueSlot()
  return map
})

/** Rows actually rendered — all of them (see the header on `virtual`). */
const rows = computed<SnTableRow[]>(() => props.data ?? [])

/** Cell text for one row / column. Objects are JSON-encoded, never `[object Object]`. */
function cellText(row: SnTableRow, prop: string): string {
  const value = row[prop]
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** Row classes: stripe + tap affordance. */
function rowClass(rowIndex: number): (string | Record<string, boolean>)[] {
  return ['sn-table__row', { 'sn-table__row--stripe': props.stripe && rowIndex % 2 === 1 }]
}

function onRowTap(rowIndex: number, row: SnTableRow): void {
  emit('row-click', { rowIndex, row })
}

function onHeaderTap(column: ResolvedColumn): void {
  if (!column.sortable) return
  const uid = columnUids.value[column.prop]
  if (uid === undefined) return
  toggleSort(uid)
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-table',
  {
    'sn-table--border': props.border,
    'sn-table--ellipsis': props.ellipsis,
    'sn-table--fixed-header': props.fixedHeader,
  },
  props.customClass,
])

/** Height of the vertical scroller; `''` = auto (no vertical scrolling). */
const heightStyle = computed(() => {
  if (props.height === undefined || props.height === '') return ''
  return toLength(props.height)
})

const rootStyle = computed(() => {
  const parts: string[] = []
  if (heightStyle.value) parts.push(`--sn-table-height: ${heightStyle.value}`)
  if (props.customStyle) parts.push(props.customStyle)
  return parts.length > 0 ? parts.join('; ') : undefined
})

/** Whether the body scrolls vertically. */
const scrollsVertically = computed(() => heightStyle.value !== '')

/** Whether the built-in empty row is replaced by the `empty` slot. */
const showsEmptySlot = computed(() => rows.value.length === 0 && Boolean(slots.empty))

/** Inline cell style: width plus the sticky offset for pinned columns. */
function cellStyle(cssWidth: string, stickyLeft: string): string {
  const parts = [`width: ${cssWidth}`, `min-width: ${cssWidth}`]
  if (stickyLeft) parts.push(`left: ${stickyLeft}`)
  return parts.join('; ')
}

/** Alignment modifier class. */
function alignClass(align: SnTableAlign): string {
  return `sn-table__cell--${align}`
}

/** `aria-sort` value of a sortable header. */
function ariaSort(column: ResolvedColumn): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (column.sortOrder === 'asc') return 'ascending'
  if (column.sortOrder === 'desc') return 'descending'
  return 'none'
}
</script>
<template>
  <view
    data-snui-component="table"
    :class="rootClass"
    :style="rootStyle"
    role="table"
  >
    <!--
      Column declarations. `sn-table-column` renders no visible node, but it has
      to be mounted for its `onMounted` registration to reach the container, so
      the default slot is rendered into this zero-size host.
    -->
    <view class="sn-table__columns" aria-hidden="true">
      <slot />
    </view>

    <scroll-view
      class="sn-table__scroller"
      :class="{ 'sn-table__scroller--vertical': scrollsVertically }"
      scroll-x
      :scroll-y="scrollsVertically"
    >
      <view class="sn-table__grid">
        <view v-if="showHeader" class="sn-table__header" role="rowgroup">
          <view class="sn-table__row sn-table__row--header" role="row">
            <view
              v-if="showsIndex"
              class="sn-table__cell sn-table__cell--header"
              :class="alignClass(indexConfig.align)"
              :style="cellStyle(toLength(indexConfig.width), '0px')"
              role="columnheader"
            >
              <text class="sn-table__cell-text">{{ indexConfig.label }}</text>
            </view>

            <view
              v-for="column in resolvedColumns"
              :key="column.prop"
              class="sn-table__cell sn-table__cell--header"
              :class="[alignClass(column.align), { 'sn-table__cell--sortable': column.sortable }]"
              :style="cellStyle(column.cssWidth, column.stickyLeft)"
              role="columnheader"
              :aria-sort="ariaSort(column)"
              @tap="onHeaderTap(column)"
            >
              <text class="sn-table__cell-text">{{ column.label }}</text>
              <view v-if="column.sortable" class="sn-table__sort" aria-hidden="true">
                <view
                  class="sn-table__sort-icon"
                  :class="{ 'sn-table__sort-icon--active': column.sortOrder === 'asc' }"
                >
                  <SnIcon :icon="ChevronUp" :size="18" />
                </view>
                <view
                  class="sn-table__sort-icon"
                  :class="{ 'sn-table__sort-icon--active': column.sortOrder === 'desc' }"
                >
                  <SnIcon :icon="ChevronDown" :size="18" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="sn-table__body" role="rowgroup">
          <view
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            :class="rowClass(rowIndex)"
            role="row"
            @tap="onRowTap(rowIndex, row)"
          >
            <view
              v-if="showsIndex"
              class="sn-table__cell"
              :class="alignClass(indexConfig.align)"
              :style="cellStyle(toLength(indexConfig.width), '0px')"
              role="cell"
            >
              <text class="sn-table__cell-text">{{ rowIndex + 1 }}</text>
            </view>

            <view
              v-for="column in resolvedColumns"
              :key="column.prop"
              class="sn-table__cell"
              :class="[alignClass(column.align), { 'sn-table__cell--fixed': column.fixed }]"
              :style="cellStyle(column.cssWidth, column.stickyLeft)"
              role="cell"
            >
              <component
                :is="cellRenderers[column.prop]"
                v-if="cellRenderers[column.prop]"
                :row="row"
                :index="rowIndex"
              />
              <text v-else class="sn-table__cell-text">{{ cellText(row, column.prop) }}</text>
            </view>
          </view>

          <view v-if="rows.length === 0" class="sn-table__empty" role="row">
            <view class="sn-table__cell sn-table__cell--empty" role="cell">
              <slot v-if="showsEmptySlot" name="empty" />
              <text v-else class="sn-table__empty-text">暂无数据</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-table {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
}

.sn-table__scroller {
  width: 100%;
  /* `--sn-table-height` is written inline only when `height` was passed. */
  max-height: var(--sn-table-height, none);
}

.sn-table__scroller--vertical {
  height: var(--sn-table-height);
}

.sn-table__grid {
  display: flex;
  flex-direction: column;
  min-width: 100%;
}

/* ── Rows ──────────────────────────────────────────────────────────────── */

.sn-table__row {
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
}

.sn-table__row--header {
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-table--fixed-header .sn-table__row--header {
  position: sticky;
  top: 0;
  z-index: 2;
}

.sn-table__row--stripe {
  background-color: var(--sn-mp-color-background-soft);
}

/* ── Cells ─────────────────────────────────────────────────────────────── */

.sn-table__cell {
  display: flex;
  flex: none;
  align-items: center;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
  word-break: break-word;
}

.sn-table__cell--left {
  justify-content: flex-start;
  text-align: left;
}
.sn-table__cell--center {
  justify-content: center;
  text-align: center;
}
.sn-table__cell--right {
  justify-content: flex-end;
  text-align: right;
}

.sn-table__cell--header {
  color: var(--sn-mp-color-text-secondary);
  font-weight: var(--sn-mp-font-weight-semibold);
  gap: var(--sn-mp-spacing-1);
}

/* Pinned column: keeps its cumulative `left` offset while the row scrolls. */
.sn-table__cell--fixed {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit;
}

/* A pinned header cell must sit above the pinned body cells. */
.sn-table__cell--header.sn-table__cell--fixed {
  z-index: 3;
}

.sn-table__cell-text {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* `ellipsis` clamps to two lines instead of one (mirrors wd-table). */
.sn-table--ellipsis .sn-table__cell-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}

/* ── Borders ───────────────────────────────────────────────────────────── */

.sn-table--border .sn-table__cell {
  border-right: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-table--border .sn-table__row .sn-table__cell:last-child {
  border-right: none;
}

/* ── Sort indicator ────────────────────────────────────────────────────── */

.sn-table__sort {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 0;
}

.sn-table__sort-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rpx;
  color: var(--sn-mp-color-text-disabled);
}

.sn-table__sort-icon--active {
  color: var(--sn-mp-color-action-primary);
}

/* ── Empty state ───────────────────────────────────────────────────────── */

.sn-table__empty {
  display: flex;
}

.sn-table__cell--empty {
  flex: 1;
  justify-content: center;
  padding: var(--sn-mp-spacing-10) var(--sn-mp-spacing-4);
}

.sn-table__empty-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
