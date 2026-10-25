<script setup lang="ts">
/**
 * sn-datetime-picker-view (uni-end) — date / time roller body.
 *
 * Reference library: wot-ui `wd-datetime-picker-view`
 *   (https://wot-ui.cn/component/datetime-picker.html)
 * Per AGENTS.md §112, the prop surface below mirrors
 * wd-datetime-picker-view 1:1. Anything new added here MUST also be added to
 * the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-datetime-picker-view/sn-datetime-picker-view.vue
 * → auto-registered as `<sn-datetime-picker-view>` in any .vue that uses it.
 *
 * ## Column derivation
 *
 * Columns are derived from `type` (year / month / date / hour / minute /
 * second) and clamped by `minDate` / `maxDate` (plus the `minHour`…
 * `maxSecond` bounds for `time`). The day count is recomputed per month so
 * 2 月 never offers a 30th. All of that is pure (`sn-datetime-picker-view-utils`)
 * so the roller stays a dumb renderer.
 *
 * ## Touch lifecycle (AGENTS.md §41)
 *
 * Same as `sn-picker-view`: the gesture math lives in the shared
 * `sn-picker-view-drag` engine (anchored offset, momentum, changedTouches
 * release, edge damping) — no global listener, no timer, no observer. Drag
 * state is component state that dies with the component. The column binds
 * `@touchmove.stop.prevent` so the page cannot scroll the gesture away.
 *
 * ## Desktop H5 input — mouse drag + wheel (additive, AGENTS.md §112)
 *
 * `bindMouseGestures` from the shared engine is attached to the root element
 * on mount — browser hosts only, mini-programs have no `document`. A mouse
 * drag runs the same drag core as touch; the wheel advances one committed row
 * per notch.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 弹层 / 工具栏 — 用 sn-datetime-picker
 *   - 日历面板（月份网格）— 用 sn-calendar-view
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PickerValue } from '../sn-picker-view/sn-picker-view-types'
import { createRollerDrag } from '../sn-picker-view/sn-picker-view-drag'
import {
  type DateParts,
  type DateTimeColumnType,
  type DateTimeType,
  columnsForType,
  daysInMonth,
  formatDate,
  formatTime,
  fromParts,
  pad,
  parseModelValue,
  range,
  toParts,
} from './sn-datetime-picker-view-utils'

defineOptions({ name: 'SnDatetimePickerView' })

/** One rendered column. */
interface RollerColumn {
  /** Column kind. */
  type: DateTimeColumnType
  /** Selectable values, ascending. */
  values: number[]
  /** Selected value. */
  selected: number
  /** Display labels, index-aligned with `values`. */
  labels: string[]
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-datetime-picker-view` 1:1 surface ───────────────────── */

    /** Selected value — a timestamp, or `HH:mm[:ss]` for `type: 'time'`. */
    modelValue?: string | number | undefined
    /** Column set. */
    type?: DateTimeType
    /** Row height in px design units. */
    itemHeight?: number
    /** Number of visible rows. */
    visibleItemCount?: number
    /** Option key holding the value (parity; columns are generated). */
    valueKey?: string
    /** Option key holding the label (parity; columns are generated). */
    labelKey?: string
    /** Custom label formatter — `(type, value) => string`. */
    formatter?: ((type: DateTimeColumnType, value: number) => string) | undefined
    /** Filter which values appear in a column. */
    filter?: ((type: DateTimeColumnType, values: number[]) => number[]) | undefined
    /** Custom column formatter — rewrites the whole column. */
    columnFormatter?: ((type: DateTimeColumnType, values: number[]) => number[]) | undefined
    /** Minimum date (timestamp). */
    minDate?: number | undefined
    /** Maximum date (timestamp). */
    maxDate?: number | undefined
    /** Minimum hour (`time` type). */
    minHour?: number
    /** Maximum hour (`time` type). */
    maxHour?: number
    /** Minimum minute (`time` type). */
    minMinute?: number
    /** Maximum minute (`time` type). */
    maxMinute?: number
    /** Show the seconds column. */
    useSecond?: boolean
    /** Minimum second. */
    minSecond?: number
    /** Maximum second. */
    maxSecond?: number
    /** Emit `change` on release instead of only on settle. */
    immediateChange?: boolean
    /** Range-mode lower bound (linkage helper). */
    boundaryMinDate?: number | undefined
    /** Range-mode upper bound (linkage helper). */
    boundaryMaxDate?: number | undefined
    /** Class on the root node. */
    customClass?: string
    /** Inline style on the root node. */
    customStyle?: string
  }>(),
  {
    modelValue: undefined,
    type: 'datetime',
    itemHeight: 44,
    visibleItemCount: 6,
    valueKey: 'value',
    labelKey: 'label',
    formatter: undefined,
    filter: undefined,
    columnFormatter: undefined,
    minDate: undefined,
    maxDate: undefined,
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
    useSecond: false,
    minSecond: 0,
    maxSecond: 59,
    immediateChange: false,
    boundaryMinDate: undefined,
    boundaryMaxDate: undefined,
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', payload: { value: string | number, columns: RollerColumn[] }): void
  (e: 'pickstart'): void
  (e: 'pickend'): void
}>()

/* ── Bounds ────────────────────────────────────────────────────────────── */

const DEFAULT_SPAN_YEARS = 10

const now = Date.now()

const fallbackTimestamp = computed(() => now)

const minTimestamp = computed(() => {
  if (props.minDate !== undefined) return props.minDate
  const d = new Date(now)
  d.setFullYear(d.getFullYear() - DEFAULT_SPAN_YEARS, 0, 1)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
})

const maxTimestamp = computed(() => {
  if (props.maxDate !== undefined) return props.maxDate
  const d = new Date(now)
  d.setFullYear(d.getFullYear() + DEFAULT_SPAN_YEARS, 11, 31)
  d.setHours(23, 59, 59, 0)
  return d.getTime()
})

const minParts = computed(() => toParts(minTimestamp.value))
const maxParts = computed(() => toParts(maxTimestamp.value))

/* ── Current value ─────────────────────────────────────────────────────── */

const parts = computed<DateParts>(() =>
  parseModelValue(props.modelValue, props.type, fallbackTimestamp.value),
)

const columnTypes = computed<DateTimeColumnType[]>(() => {
  const base = columnsForType(props.type)
  if ((props.type === 'time' || props.type === 'datetime') && props.useSecond) {
    return [...base, 'second']
  }
  return base
})

/* ── Column derivation ─────────────────────────────────────────────────── */

/** Raw (unfiltered) values for one column, honouring the min / max bounds. */
function rawValues(type: DateTimeColumnType, current: DateParts): number[] {
  const min = minParts.value
  const max = maxParts.value
  switch (type) {
    case 'year': return range(min.year, max.year)
    case 'month': {
      const from = current.year === min.year ? min.month : 1
      const to = current.year === max.year ? max.month : 12
      return range(from, to)
    }
    case 'date': {
      const total = daysInMonth(current.year, current.month)
      let from = 1
      let to = total
      if (current.year === min.year && current.month === min.month) from = min.date
      if (current.year === max.year && current.month === max.month) to = Math.min(to, max.date)
      return range(from, to)
    }
    case 'hour': {
      if (props.type === 'time') return range(props.minHour, props.maxHour)
      let from = 0
      let to = 23
      if (sameDay(current, min)) from = min.hour
      if (sameDay(current, max)) to = max.hour
      return range(from, to)
    }
    case 'minute': {
      if (props.type === 'time') return range(props.minMinute, props.maxMinute)
      let from = 0
      let to = 59
      if (sameHour(current, min)) from = min.minute
      if (sameHour(current, max)) to = max.minute
      return range(from, to)
    }
    default: {
      if (props.type === 'time') return range(props.minSecond, props.maxSecond)
      let from = 0
      let to = 59
      if (sameMinute(current, min)) from = min.second
      if (sameMinute(current, max)) to = max.second
      return range(from, to)
    }
  }
}

function sameDay(a: DateParts, b: DateParts): boolean {
  return a.year === b.year && a.month === b.month && a.date === b.date
}

function sameHour(a: DateParts, b: DateParts): boolean {
  return sameDay(a, b) && a.hour === b.hour
}

function sameMinute(a: DateParts, b: DateParts): boolean {
  return sameHour(a, b) && a.minute === b.minute
}

/** Apply the user hooks, then build the rendered column. */
function buildColumn(type: DateTimeColumnType, current: DateParts): RollerColumn {
  let values = rawValues(type, current)
  if (props.filter) values = props.filter(type, values)
  if (props.columnFormatter) values = props.columnFormatter(type, values)
  const selected = current[type]
  return {
    type,
    values,
    selected: values.includes(selected) ? selected : (values[0] ?? selected),
    labels: values.map(value => formatLabel(type, value)),
  }
}

function formatLabel(type: DateTimeColumnType, value: number): string {
  if (props.formatter) return props.formatter(type, value)
  if (type === 'year') return String(value)
  return pad(value)
}

const columns = computed<RollerColumn[]>(() => {
  const current = parts.value
  return columnTypes.value.map(type => buildColumn(type, current))
})

/* ── Selection ─────────────────────────────────────────────────────────── */

/** Value of a column at a row index. */
function valueAt(columnIndex: number, rowIndex: number): number {
  const column = columns.value[columnIndex]
  if (!column) return 0
  return column.values[rowIndex] ?? column.selected
}

/** Index of the selected row inside a column. */
function indexOf(columnIndex: number): number {
  const column = columns.value[columnIndex]
  if (!column) return 0
  const found = column.values.indexOf(column.selected)
  return found < 0 ? 0 : found
}

/** Emit a value derived from a full parts record. */
function emitParts(next: DateParts, columnIndex: number): void {
  const value = props.type === 'time'
    ? formatTime(fromParts(next), props.useSecond)
    : fromParts(next)
  if (value === props.modelValue) return
  emit('update:modelValue', value)
  emit('change', { value, columns: columns.value })
  void columnIndex
}

function selectRow(columnIndex: number, rowIndex: number): void {
  const column = columns.value[columnIndex]
  if (!column) return
  const value = column.values[rowIndex]
  if (value === undefined || value === column.selected) return
  const next: DateParts = { ...parts.value }
  next[column.type] = value
  // Rolling the month forward from the 31st lands on a shorter month — clamp.
  next.date = Math.min(next.date, daysInMonth(next.year, next.month))
  emitParts(next, columnIndex)
}

/* ── Geometry (all rpx — 1px design = 2rpx) ────────────────────────────── */

const RATIO = 2

const itemRpx = computed(() => Math.max(props.itemHeight, 1) * RATIO)
const itemHeightRpx = computed(() => `${itemRpx.value}rpx`)
const visibleCount = computed(() => Math.max(props.visibleItemCount, 1))
const columnHeightRpx = computed(() => `${itemRpx.value * visibleCount.value}rpx`)
const maskHeightRpx = computed(() => {
  const rest = itemRpx.value * (visibleCount.value - 1)
  return `${Math.max(rest / 2, 0)}rpx`
})

/* ── Drag engine (shared with sn-picker-view) ──────────────────────────── */

const drag = createRollerDrag({
  isDisabled: () => false,
  itemRpx: () => itemRpx.value,
  visibleCount: () => visibleCount.value,
  indexOf: columnIndex => indexOf(columnIndex),
  lengthOf: columnIndex => columns.value[columnIndex]?.values.length ?? 0,
  isRowDisabled: () => false,
  isImmediate: () => props.immediateChange,
  commit: (columnIndex, rowIndex) => selectRow(columnIndex, rowIndex),
  onStart: () => emit('pickstart'),
  onEnd: () => emit('pickend'),
})

const {
  isDragging,
  snapDurationMs,
  columnOffsetRpx,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  shouldIgnoreTap,
  bindMouseGestures,
} = drag

/* ── Desktop H5: mouse drag + wheel (additive) ─────────────────────────── */

const rootRef = ref<unknown>(null)
let disposeMouseGestures: (() => void) | null = null

onMounted(() => {
  // Browser hosts only — a mini-program page has no `document`, and uni H5
  // wraps `<view>` in a component instance, so unwrap `$el` when present.
  if (typeof document === 'undefined') return
  const el = (rootRef.value as { $el?: unknown } | null)?.$el
    ?? (rootRef.value as unknown)
  if (el instanceof HTMLElement) disposeMouseGestures = bindMouseGestures(el)
})

onBeforeUnmount(() => {
  disposeMouseGestures?.()
  disposeMouseGestures = null
})

function onItemTap(columnIndex: number, rowIndex: number): void {
  // Uni re-fires `tap` on the touchstart target when the finger lifts; after
  // a real drag that row is no longer the one the gesture settled on.
  if (shouldIgnoreTap()) return
  selectRow(columnIndex, rowIndex)
}

/* ── Public API (wd-datetime-picker-view parity) ───────────────────────── */

function getSelectedOptions(): Array<{ value: number, label: string }> {
  return columns.value.map(column => ({
    value: column.selected,
    label: formatLabel(column.type, column.selected),
  }))
}

function correctValue(value: string | number): string | number {
  const parsed = parseModelValue(value, props.type, fallbackTimestamp.value)
  return props.type === 'time'
    ? formatTime(fromParts(parsed), props.useSecond)
    : fromParts(parsed)
}

function getOriginColumns(): RollerColumn[] {
  return columns.value
}

defineExpose({ getSelectedOptions, correctValue, getOriginColumns })

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-datetime-picker-view',
  `sn-datetime-picker-view--${props.type}`,
  props.customClass,
])

const rootStyle = computed(() => {
  const vars = [
    `--sn-datetime-picker-view-item-height: ${itemHeightRpx.value}`,
    `--sn-datetime-picker-view-mask-height: ${maskHeightRpx.value}`,
    `--sn-datetime-picker-view-settle-duration: ${snapDurationMs.value}ms`,
  ].join('; ')
  return props.customStyle ? `${vars}; ${props.customStyle}` : vars
})

/** Human-readable value echoed to assistive tech. */
const ariaValue = computed(() =>
  props.type === 'time'
    ? formatTime(fromParts(parts.value), props.useSecond)
    : `${formatDate(fromParts(parts.value))} ${formatTime(fromParts(parts.value), props.useSecond)}`,
)

</script>

<template>
  <view
    ref="rootRef"
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'datetime-picker-view'"
    :data-snui-mouse-gesture="'datetime-picker-view'"
    role="group"
    :aria-label="ariaValue"
  >
    <view
      v-for="(column, columnIndex) in columns"
      :key="column.type"
      class="sn-datetime-picker-view__column"
      :data-snui-column="columnIndex"
      :style="{ height: columnHeightRpx }"
      @touchstart="onTouchStart($event, columnIndex)"
      @touchmove.stop.prevent="onTouchMove($event, columnIndex)"
      @touchend="onTouchEnd($event, columnIndex)"
      @touchcancel="onTouchCancel(columnIndex)"
    >
      <view
        class="sn-datetime-picker-view__roller"
        :class="{ 'sn-datetime-picker-view__roller--dragging': isDragging }"
        :style="{ transform: `translateY(${columnOffsetRpx(columnIndex)}rpx)` }"
      >
        <view
          v-for="(value, rowIndex) in column.values"
          :key="value"
          v-memo="[
            column.labels[rowIndex],
            column.selected === value,
            itemHeightRpx,
          ]"
          :class="[
            'sn-datetime-picker-view__item',
            { 'sn-datetime-picker-view__item--active': column.selected === value },
          ]"
          :style="{ height: itemHeightRpx }"
          role="button"
          :aria-selected="column.selected === value ? 'true' : 'false'"
          @tap="onItemTap(columnIndex, rowIndex)"
        >{{ column.labels[rowIndex] }}</view>
      </view>
      <view class="sn-datetime-picker-view__mask sn-datetime-picker-view__mask--top" aria-hidden="true" />
      <view class="sn-datetime-picker-view__mask sn-datetime-picker-view__mask--bottom" aria-hidden="true" />
      <view class="sn-datetime-picker-view__indicator" aria-hidden="true" />
    </view>
    <text class="sn-datetime-picker-view__sr" aria-live="polite">{{ ariaValue }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-datetime-picker-view {
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  padding: var(--sn-mp-spacing-3) 0;
  box-sizing: border-box;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
  overflow: hidden;
}

.sn-datetime-picker-view__column {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  /* H5 / App webview: a roller drag must never become a page scroll.
     Mini-programs use `catchtouchmove` (the `.stop` modifier) instead. */
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.sn-datetime-picker-view__roller {
  /* Settle only — the length scales with the distance to the snapped row. */
  transition: transform var(--sn-datetime-picker-view-settle-duration, 180ms) cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

/* While a finger is down the roller tracks it 1:1: any transition here makes
   the wheel lag behind and read as "the wheel will not move". */
.sn-datetime-picker-view__roller--dragging {
  transition: none;
}

.sn-datetime-picker-view__item {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-secondary);
  overflow: hidden;
  white-space: nowrap;
}

.sn-datetime-picker-view__item--active {
  color: var(--sn-mp-color-text-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-datetime-picker-view__indicator {
  position: absolute;
  left: var(--sn-mp-spacing-2);
  right: var(--sn-mp-spacing-2);
  top: 50%;
  height: var(--sn-datetime-picker-view-item-height);
  margin-top: calc(var(--sn-datetime-picker-view-item-height) / -2);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  pointer-events: none;
  z-index: 2;
}

.sn-datetime-picker-view__mask {
  position: absolute;
  left: 0;
  right: 0;
  height: var(--sn-datetime-picker-view-mask-height);
  pointer-events: none;
  z-index: 1;
}

.sn-datetime-picker-view__mask--top {
  top: 0;
  background: linear-gradient(to bottom, var(--sn-mp-color-background-elevated), transparent);
}

.sn-datetime-picker-view__mask--bottom {
  bottom: 0;
  background: linear-gradient(to top, var(--sn-mp-color-background-elevated), transparent);
}

/* Screen-reader echo of the current value. Visually hidden, never removed from
 * the accessibility tree (mini-program `text` has no `clip-path` support, so
 * a 1px box + overflow hidden is used instead). */
.sn-datetime-picker-view__sr {
  position: absolute;
  width: 2rpx;
  height: 2rpx;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

/* Doodle skin — heavier indicator. */
.snui-skin-doodle .sn-datetime-picker-view__indicator {
  border-top-width: 4rpx;
  border-bottom-width: 4rpx;
  border-top-color: var(--sn-mp-color-text-primary);
  border-bottom-color: var(--sn-mp-color-text-primary);
}
</style>
