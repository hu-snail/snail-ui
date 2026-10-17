<template>
  <div
    ref="rootRef"
    :class="['sn-date-picker', `sn-date-picker--${size}`, {
      'sn-date-picker--disabled': disabled,
      'sn-date-picker--readonly': readonly,
      'sn-date-picker--focused': isFocused,
      'sn-date-picker--active': isPanelOpen,
      [`sn-date-picker--status-${status}`]: status !== 'default',
    }, customClass]"
    :data-snui-component="'date-picker'"
    :data-size="size"
    :data-status="status"
    :style="wrapperStyle || undefined"
  >
    <div
      class="sn-date-picker__selection"
      role="combobox"
      :aria-expanded="isPanelOpen ? 'true' : 'false'"
      aria-haspopup="grid"
      :aria-controls="isPanelOpen ? panelId : undefined"
      :aria-activedescendant="activeDescendant ?? undefined"
      :aria-label="ariaLabel || 'Date picker'"
      :aria-invalid="status === 'error' ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :tabindex="isInteractive ? 0 : -1"
      @mousedown="onTriggerMouseDown"
      @click="onTriggerClick"
      @keydown="onTriggerKeyDown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <template v-if="isRange">
        <span v-if="rangeStartText !== null" class="sn-date-picker__value">{{ rangeStartText }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ rangePlaceholders[0] }}</span>
        <span class="sn-date-picker__separator" aria-hidden="true">至</span>
        <span v-if="rangeEndText !== null" class="sn-date-picker__value">{{ rangeEndText }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ rangePlaceholders[1] }}</span>
      </template>
      <template v-else>
        <span v-if="singleText !== null" class="sn-date-picker__value">{{ singleText }}</span>
        <span v-else class="sn-date-picker__placeholder">{{ singlePlaceholder }}</span>
      </template>
    </div>

    <!-- Suffix area: clear button | arrow -->
    <div class="sn-date-picker__suffix">
      <button
        v-if="clearable && hasValue && isInteractive"
        type="button"
        class="sn-date-picker__clear"
        aria-label="Clear date"
        :tabindex="-1"
        @mousedown.prevent
        @click.stop="clearValue"
      >
        <SnIcon :icon="CloseIcon" :size="11" />
      </button>
      <span
        v-else
        class="sn-date-picker__arrow"
        :class="{ 'sn-date-picker__arrow--up': isPanelOpen }"
        aria-hidden="true"
      >
        <SnIcon :icon="ChevronDownIcon" :size="13" />
      </span>
    </div>

    <!-- Date panel — teleported to body -->
    <Teleport to="body">
      <div
        v-if="isPanelOpen"
        :id="panelId"
        ref="panelRef"
        :class="['sn-date-picker-panel', `sn-date-picker-panel--${placement}`]"
        :style="panelStyle"
        role="group"
        :aria-label="ariaLabel || 'Date picker panel'"
        @mousedown.prevent
      >
        <div class="sn-date-picker-panel__calendars">
          <div
            v-for="cal in calendars"
            :key="cal.key"
            class="sn-date-picker-calendar"
          >
            <div class="sn-date-picker-calendar__header">
              <button type="button" class="sn-date-picker-nav" :aria-label="`Previous ${navUnitLabel}s`" :tabindex="-1" @click="shiftAnchor(-navBigStep)">
                <SnIcon :icon="DoubleChevronLeftIcon" :size="12" />
              </button>
              <button type="button" class="sn-date-picker-nav" :aria-label="`Previous ${navUnitLabel}`" :tabindex="-1" @click="shiftAnchor(-1)">
                <SnIcon :icon="ChevronLeftIcon" :size="12" />
              </button>
              <button
                type="button"
                class="sn-date-picker-calendar__title"
                :tabindex="-1"
                @click="onTitleClick"
              >{{ cal.title }}</button>
              <button type="button" class="sn-date-picker-nav" :aria-label="`Next ${navUnitLabel}`" :tabindex="-1" @click="shiftAnchor(1)">
                <SnIcon :icon="ChevronRightIcon" :size="12" />
              </button>
              <button type="button" class="sn-date-picker-nav" :aria-label="`Next ${navUnitLabel}s`" :tabindex="-1" @click="shiftAnchor(navBigStep)">
                <SnIcon :icon="DoubleChevronRightIcon" :size="12" />
              </button>
            </div>

            <!-- Day view -->
            <div v-if="viewMode === 'day'" class="sn-date-picker-grid" role="grid" :aria-label="cal.title">
              <div class="sn-date-picker-grid__row" role="row">
                <span
                  v-for="wd in WEEKDAY_LABELS"
                  :key="wd"
                  class="sn-date-picker-grid__weekday"
                  role="columnheader"
                >{{ wd }}</span>
              </div>
              <div v-for="(row, ri) in cal.monthGrid" :key="ri" class="sn-date-picker-grid__row" role="row">
                <div
                  v-for="cell in row"
                  :key="cell.ts"
                  :id="cellId(cell.ts)"
                  class="sn-date-picker-cell"
                  :class="{
                    'sn-date-picker-cell--other-month': !cell.isCurrentMonth,
                    'sn-date-picker-cell--selected': isCellSelected(cell.ts),
                    'sn-date-picker-cell--start': isCellStart(cell.ts),
                    'sn-date-picker-cell--end': isCellEnd(cell.ts),
                    'sn-date-picker-cell--in-range': isCellInRange(cell.ts),
                    'sn-date-picker-cell--cursor': cursor !== null && cell.ts === startOfDay(cursor),
                  }"
                  role="gridcell"
                  :aria-selected="isCellSelected(cell.ts) || isCellStart(cell.ts) || isCellEnd(cell.ts) ? 'true' : 'false'"
                  :data-value="cell.ts"
                  @click="onDayCellClick(cell.ts)"
                >{{ cell.day }}</div>
              </div>
            </div>

            <!-- Month-of-year view -->
            <div v-else-if="viewMode === 'month'" class="sn-date-picker-grid sn-date-picker-grid--unit" role="grid" :aria-label="cal.yearTitle">
              <div v-for="(row, ri) in cal.monthUnitRows" :key="ri" class="sn-date-picker-grid__row" role="row">
                <div
                  v-for="cell in row"
                  :key="cell.value"
                  :id="unitCellId(cal.key, 'm', cell.value)"
                  class="sn-date-picker-cell sn-date-picker-cell--unit"
                  :class="{
                    'sn-date-picker-cell--selected': isMonthCellSelected(cell.ts, cal.year),
                    'sn-date-picker-cell--cursor': isMonthCellCursor(cell.ts, cal.year),
                  }"
                  role="gridcell"
                  :aria-selected="isMonthCellSelected(cell.ts, cal.year) ? 'true' : 'false'"
                  :data-value="cell.value"
                  @click="onMonthCellClick(cell.ts)"
                >{{ cell.label }}</div>
              </div>
            </div>

            <!-- Year view -->
            <div v-else class="sn-date-picker-grid sn-date-picker-grid--unit" role="grid" :aria-label="cal.decadeTitle">
              <div v-for="(row, ri) in cal.yearUnitRows" :key="ri" class="sn-date-picker-grid__row" role="row">
                <div
                  v-for="cell in row"
                  :key="cell.value"
                  :id="unitCellId(cal.key, 'y', cell.value)"
                  class="sn-date-picker-cell sn-date-picker-cell--unit"
                  :class="{
                    'sn-date-picker-cell--selected': isYearCellSelected(cell.ts),
                    'sn-date-picker-cell--cursor': isYearCellCursor(cell.ts),
                  }"
                  role="gridcell"
                  :aria-selected="isYearCellSelected(cell.ts) ? 'true' : 'false'"
                  :data-value="cell.value"
                  @click="onYearCellClick(cell.ts)"
                >{{ cell.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Datetime time columns -->
        <div v-if="hasTime && !isRange" class="sn-date-picker-panel__time">
          <div
            v-for="col in timeColumns"
            :key="col.key"
            class="sn-date-picker-time-col"
            role="listbox"
            :aria-label="col.ariaLabel"
          >
            <div
              v-for="v in col.values"
              :key="v"
              class="sn-date-picker-time-item"
              :class="{ 'sn-date-picker-time-item--selected': timeDraft[col.key] === v }"
              role="option"
              :aria-selected="timeDraft[col.key] === v ? 'true' : 'false'"
              :data-unit="col.key"
              :data-value="v"
              @click="onTimeCellClick('start', col.key, v)"
            >{{ pad2(v) }}</div>
          </div>
        </div>

        <div v-if="hasTime && isRange && rangeDraft.start !== null && rangeDraft.end !== null" class="sn-date-picker-panel__time sn-date-picker-panel__time--range">
          <div v-for="side in RANGE_SIDES" :key="side" class="sn-date-picker-time-group">
            <div class="sn-date-picker-time-group__label">{{ side === 'start' ? '开始时间' : '结束时间' }}</div>
            <div class="sn-date-picker-panel__time">
              <div
                v-for="col in timeColumns"
                :key="col.key"
                class="sn-date-picker-time-col"
                role="listbox"
                :aria-label="`${side === 'start' ? '开始' : '结束'}${col.ariaLabel}`"
              >
                <div
                  v-for="v in col.values"
                  :key="v"
                  class="sn-date-picker-time-item"
                  :class="{ 'sn-date-picker-time-item--selected': rangeTimeDraft[side][col.key] === v }"
                  role="option"
                  :aria-selected="rangeTimeDraft[side][col.key] === v ? 'true' : 'false'"
                  :data-unit="col.key"
                  :data-value="v"
                  @click="onTimeCellClick(side, col.key, v)"
                >{{ pad2(v) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasTime" class="sn-date-picker-panel__footer">
          <button type="button" class="sn-date-picker-panel__confirm" :tabindex="-1" @click="confirmAndClose">
            确认
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
/**
 * SnDatePicker — web-end date picker component.
 *
 * Reference library: naive-ui `n-date-picker`
 *   (https://www.naiveui.com/zh-CN/light/components/date-picker)
 *
 * Parity (this version):
 *   - type: 'date' | 'datetime' | 'month' | 'year' | 'daterange' |
 *     'datetimerange'. Range types bind `[start, end]` timestamps.
 *   - modelValue: millisecond timestamps, local timezone (Date convention).
 *   - format: lowercase tokens yyyy/yy/MM/M/dd/d/HH/H/mm/m/ss/s
 *     (uppercase 'YYYY-MM-DD' NOT supported — see ai-description.md).
 *   - placeholder (string, or [start, end] pair in range modes) /
 *     clearable / disabled / readonly / size / status.
 *   - panel: Teleport + viewport flip; Monday-first month grid with
 *     adjacent-month cells; month / year navigation grids (click the panel
 *     title to drill down — navigation-only in date modes, committing in
 *     month / year types).
 *   - datetime: additional hour/minute/second columns + 确认 footer.
 *   - range: two side-by-side calendars, start-then-end selection with
 *     automatic swap when end < start, selected interval highlighted.
 *   - keyboard: Arrow keys move the cursor, PageUp/PageDown page by the
 *     header unit, Enter picks/confirms, Escape closes (simplified).
 *   - events: update:modelValue, change, clear, focus, blur.
 *   - a11y: combobox trigger + role=grid/gridcell panels with
 *     aria-selected and aria-activedescendant.
 *
 * Not ported (out of scope, see ai-description.md): shortcuts, dual-panel
 * month/year quick jump, actions bar, formatted-value / value-format,
 * disabled-date, i18n beyond zh-CN strings.
 *
 * Per AGENTS.md §30/31: props / events / tokens / accessibility are
 * declared below; CSS uses `--sn-web-date-picker-*` aliases with
 * `--sn-web-color-*` fallbacks only.
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
} from './sn-date-picker-icons'
import {
  DEFAULT_FORMATS,
  WEEKDAY_LABELS,
  addMonths,
  buildMonthGrid,
  buildMonthUnitGrid,
  buildYearUnitGrid,
  combineDateTime,
  formatDecadeTitle,
  formatMonthTitle,
  formatDate,
  getDateParts,
  hasTimePart,
  isRangeType,
  isSameDay,
  isSameMonth,
  isSameYear,
  pad2,
  rangeInclusive,
  startOfDay,
  type SnDateRangeValue,
  type SnDatePickerSize,
  type SnDatePickerStatus,
  type SnDatePickerType,
  type SnUnitGridCell,
} from './sn-date-picker-types'

defineOptions({ name: 'SnDatePicker' })

const props = withDefaults(
  defineProps<{
    /** Bound value: timestamp (single) | [start, end] (range) | null. */
    modelValue?: number | [number, number] | null
    /** Panel / value mode. */
    type?: SnDatePickerType
    /** Display format — lowercase tokens (yyyy MM dd HH mm ss). */
    format?: string
    /** Placeholder; `[start, end]` pair in range modes. */
    placeholder?: string | [string, string]
    /** Show the clear (×) button when a value is present. */
    clearable?: boolean
    /** Disables interaction. */
    disabled?: boolean
    /** Read-only — opens nothing, commits nothing. */
    readonly?: boolean
    /** Visual size preset. */
    size?: SnDatePickerSize
    /** Validation-driven visual status. */
    status?: SnDatePickerStatus
    /** Accessible name for the trigger (fallback: 'Date picker'). */
    ariaLabel?: string
    /** Class on the root wrapper. */
    customClass?: string
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>
  }>(),
  {
    modelValue: null,
    type: 'date',
    format: '',
    clearable: false,
    disabled: false,
    readonly: false,
    size: 'medium',
    status: 'default',
    ariaLabel: '',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** v-model sync — fires on any commit. */
  (e: 'update:modelValue', value: number | [number, number] | null): void
  /** Value committed (also fires for clear). */
  (e: 'change', value: number | [number, number] | null): void
  /** Value cleared via the × button. */
  (e: 'clear'): void
  /** Trigger gained focus. */
  (e: 'focus', event: FocusEvent): void
  /** Trigger lost focus. */
  (e: 'blur', event: FocusEvent): void
}>()

/* ─────────── Local view model ─────────── */

/** Keyboard cursor highlight unit. */
type SnTimeUnit = 'hour' | 'minute' | 'second'
type SnTimeOfDay = Record<SnTimeUnit, number>
type SnRangeSide = 'start' | 'end'
const RANGE_SIDES: readonly SnRangeSide[] = ['start', 'end']

/** Panel grid view — 'day' for date grids, 'month'/'year' are drill-downs. */
type SnViewMode = 'day' | 'month' | 'year'

const DEFAULT_RANGE_PLACEHOLDERS: readonly [string, string] = ['开始日期', '结束日期']

/** Module-level counter so every instance owns unique DOM ids. */
let datePickerInstanceSeed = 0
const instanceId = ++datePickerInstanceSeed
const panelId = `sn-date-picker-panel-${instanceId}`

function cellId(ts: number): string {
  return `sn-date-picker-cell-${instanceId}-${ts}`
}

function unitCellId(calKey: string, kind: 'm' | 'y', value: number): string {
  return `sn-date-picker-unit-${instanceId}-${calKey}-${kind}-${value}`
}

/* ─────────── State ─────────── */

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const isPanelOpen = ref(false)
const isFocused = ref(false)
const viewMode = ref<SnViewMode>('day')
/** Anchor timestamp of the left calendar (any instant inside its month). */
const anchorTs = ref<number>(Date.now())
/** Keyboard cursor — the highlighted date / month / year. */
const cursor = ref<number>(Date.now())
/** Single-mode pending day (local midnight). */
const dateDraft = ref<number | null>(null)
/** Single-mode pending time-of-day. */
const timeDraft = ref<SnTimeOfDay>({ hour: 0, minute: 0, second: 0 })
/** Range-mode pending days (local midnights). */
const rangeDraft = ref<{ start: number | null; end: number | null }>({ start: null, end: null })
/** Range-mode pending time-of-day per side. */
const rangeTimeDraft = ref<Record<SnRangeSide, SnTimeOfDay>>({
  start: { hour: 0, minute: 0, second: 0 },
  end: { hour: 0, minute: 0, second: 0 },
})

const isRange = computed(() => isRangeType(props.type))
const hasTime = computed(() => hasTimePart(props.type))
const isInteractive = computed(() => !props.disabled && !props.readonly)
const resolvedFormat = computed(() => props.format || DEFAULT_FORMATS[props.type])

/** Normalized single value (null in range modes). */
const singleModel = computed<number | null>(() => {
  if (isRange.value) return null
  return typeof props.modelValue === 'number' ? props.modelValue : null
})

/** Normalized range value (null in single modes). */
const rangeModel = computed<SnDateRangeValue>(() => {
  if (!isRange.value) return null
  if (Array.isArray(props.modelValue) && props.modelValue.length === 2) {
    return [props.modelValue[0], props.modelValue[1]]
  }
  return null
})

const hasValue = computed(() => singleModel.value !== null || rangeModel.value !== null)

/* ─────────── Display ─────────── */

const singlePlaceholder = computed(() =>
  typeof props.placeholder === 'string' && props.placeholder !== ''
    ? props.placeholder
    : '请选择日期',
)

const rangePlaceholders = computed<readonly [string, string]>(() => {
  if (Array.isArray(props.placeholder) && props.placeholder.length === 2) {
    return [props.placeholder[0], props.placeholder[1]]
  }
  return DEFAULT_RANGE_PLACEHOLDERS
})

const singleText = computed<string | null>(() =>
  singleModel.value === null ? null : formatDate(singleModel.value, resolvedFormat.value),
)

const rangeStartText = computed<string | null>(() => {
  const v = rangeModel.value
  if (v === null) return rangeDraft.value.start !== null && isPanelOpen.value
    ? formatDate(rangeDraft.value.start, resolvedFormat.value)
    : null
  return formatDate(v[0], resolvedFormat.value)
})

const rangeEndText = computed<string | null>(() => {
  const v = rangeModel.value
  if (v === null) return rangeDraft.value.end !== null && isPanelOpen.value
    ? formatDate(rangeDraft.value.end, resolvedFormat.value)
    : null
  return formatDate(v[1], resolvedFormat.value)
})

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle
  return Object.entries(props.customStyle ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
})

/* ─────────── Calendar model ─────────── */

interface SnCalendarViewModel {
  key: string
  year: number
  month: number
  title: string
  yearTitle: string
  decadeTitle: string
  monthGrid: ReturnType<typeof buildMonthGrid>
  monthUnitRows: SnUnitGridCell[][]
  yearUnitRows: SnUnitGridCell[][]
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size))
  return rows
}

function calendarOf(anchor: number, key: string): SnCalendarViewModel {
  const p = getDateParts(anchor)
  return {
    key,
    year: p.year,
    month: p.month,
    title: formatMonthTitle(p.year, p.month),
    yearTitle: `${p.year}年`,
    decadeTitle: formatDecadeTitle(p.year),
    monthGrid: buildMonthGrid(p.year, p.month),
    monthUnitRows: chunk(buildMonthUnitGrid(p.year), 4),
    yearUnitRows: chunk(buildYearUnitGrid(p.year), 4),
  }
}

const calendars = computed<SnCalendarViewModel[]>(() => {
  if (isRange.value) {
    return [calendarOf(anchorTs.value, 'a'), calendarOf(addMonths(anchorTs.value, 1), 'b')]
  }
  return [calendarOf(anchorTs.value, 'a')]
})

/** Header step unit label (a11y for the nav buttons). */
const navUnitLabel = computed(() =>
  viewMode.value === 'day' ? 'month' : viewMode.value === 'month' ? 'year' : 'decade',
)

/** Big step: ±1 year in day view, ±decade in month/year views. */
const navBigStep = computed(() => (viewMode.value === 'day' ? 12 : 120))

/* ─────────── Cell state predicates (day view) ─────────── */

function isCellSelected(ts: number): boolean {
  if (isRange.value) return false
  if (!isPanelOpen.value) return singleModel.value !== null && isSameDay(ts, singleModel.value)
  return dateDraft.value !== null && isSameDay(ts, dateDraft.value)
}

function isCellStart(ts: number): boolean {
  if (isRange.value) {
    if (rangeModel.value !== null) return isSameDay(ts, rangeModel.value[0])
    return rangeDraft.value.start !== null && isSameDay(ts, rangeDraft.value.start)
  }
  return false
}

function isCellEnd(ts: number): boolean {
  if (isRange.value) {
    if (rangeModel.value !== null) return isSameDay(ts, rangeModel.value[1])
    return rangeDraft.value.end !== null && isSameDay(ts, rangeDraft.value.end)
  }
  return false
}

function rangeBounds(): { start: number | null; end: number | null } {
  if (isRange.value && rangeModel.value !== null) {
    return { start: rangeModel.value[0], end: rangeModel.value[1] }
  }
  return rangeDraft.value
}

function isCellInRange(ts: number): boolean {
  const { start, end } = rangeBounds()
  if (start === null || end === null) return false
  const day = startOfDay(ts)
  return day > startOfDay(start) && day < startOfDay(end)
}

/* ─────────── Month / year view predicates ─────────── */

function isMonthCellSelected(ts: number, calYear: number): boolean {
  if (props.type === 'month') {
    if (!isPanelOpen.value || dateDraft.value === null) {
      return singleModel.value !== null && isSameMonth(ts, singleModel.value)
    }
    return isSameMonth(ts, dateDraft.value)
  }
  // date modes: navigation grid — highlight the anchor month.
  return isSameMonth(ts, anchorTs.value) && getDateParts(ts).year === calYear
}

function isMonthCellCursor(ts: number, calYear: number): boolean {
  return isSameMonth(ts, cursor.value) && getDateParts(ts).year === calYear
}

function isYearCellSelected(ts: number): boolean {
  if (props.type === 'year') {
    if (!isPanelOpen.value || dateDraft.value === null) {
      return singleModel.value !== null && isSameYear(ts, singleModel.value)
    }
    return isSameYear(ts, dateDraft.value)
  }
  return isSameYear(ts, anchorTs.value)
}

function isYearCellCursor(ts: number): boolean {
  return isSameYear(ts, cursor.value)
}

/* ─────────── Time columns ─────────── */

const timeColumns = computed(() => [
  { key: 'hour' as const, values: rangeInclusive(0, 23), ariaLabel: '小时' },
  { key: 'minute' as const, values: rangeInclusive(0, 59), ariaLabel: '分钟' },
  { key: 'second' as const, values: rangeInclusive(0, 59), ariaLabel: '秒' },
])

/* ─────────── aria-activedescendant ─────────── */

const activeDescendant = computed<string | null>(() => {
  if (!isPanelOpen.value) return null
  if (viewMode.value === 'day') {
    return cellId(startOfDay(cursor.value))
  }
  // Unit views always anchor on the left calendar.
  const p = getDateParts(cursor.value)
  return unitCellId('a', viewMode.value === 'month' ? 'm' : 'y',
    viewMode.value === 'month' ? p.month : p.year)
})

/* ─────────── Panel positioning (simplified popper) ─────────── */

const PANEL_VIEWPORT_GAP = 4
const placement = ref<'bottom' | 'top'>('bottom')
const panelStyle = ref<Record<string, string>>({})

function repositionPanel(): void {
  const root = rootRef.value
  const panel = panelRef.value
  if (!root || !panel) return
  const rootRect = root.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  const left = Math.min(
    Math.max(PANEL_VIEWPORT_GAP, rootRect.left),
    Math.max(PANEL_VIEWPORT_GAP, vw - panelRect.width - PANEL_VIEWPORT_GAP),
  )

  // Bottom preferred; flip to top when the viewport lacks room below
  // but has room above.
  const roomBelow = vh - rootRect.bottom
  const roomAbove = rootRect.top
  const useTop = roomBelow < panelRect.height && roomAbove > roomBelow
  placement.value = useTop ? 'top' : 'bottom'

  const top = useTop
    ? Math.max(PANEL_VIEWPORT_GAP, rootRect.top - panelRect.height)
    : rootRect.bottom

  panelStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    'min-width': `${Math.round(rootRect.width)}px`,
  }
}

/* ─────────── Outside-click dismiss (§41/§42) ─────────── */

function onDocumentMouseDown(event: MouseEvent): void {
  if (!isPanelOpen.value) return
  const target = event.target as Node | null
  if (!target) return
  if (rootRef.value && rootRef.value.contains(target)) return
  if (panelRef.value && panelRef.value.contains(target)) return
  closePanel()
}

/* ─────────── Open / close ─────────── */

function initDraftsFromModel(): void {
  const now = Date.now()
  if (isRange.value) {
    const v = rangeModel.value
    if (v !== null) {
      rangeDraft.value = { start: startOfDay(v[0]), end: startOfDay(v[1]) }
      const sa = getDateParts(v[0])
      const sb = getDateParts(v[1])
      rangeTimeDraft.value = {
        start: { hour: sa.hour, minute: sa.minute, second: sa.second },
        end: { hour: sb.hour, minute: sb.minute, second: sb.second },
      }
      anchorTs.value = v[0]
      cursor.value = v[0]
    } else {
      rangeDraft.value = { start: null, end: null }
      rangeTimeDraft.value = {
        start: { hour: 0, minute: 0, second: 0 },
        end: { hour: 0, minute: 0, second: 0 },
      }
      anchorTs.value = now
      cursor.value = now
    }
  } else {
    const v = singleModel.value
    if (v !== null) {
      dateDraft.value = startOfDay(v)
      const p = getDateParts(v)
      timeDraft.value = { hour: p.hour, minute: p.minute, second: p.second }
      anchorTs.value = v
      cursor.value = v
    } else {
      dateDraft.value = startOfDay(now)
      timeDraft.value = { hour: 0, minute: 0, second: 0 }
      anchorTs.value = now
      cursor.value = now
    }
  }
  viewMode.value = props.type === 'month' ? 'month' : props.type === 'year' ? 'year' : 'day'
}

function openPanel(): void {
  if (!isInteractive.value || isPanelOpen.value) return
  isPanelOpen.value = true
  initDraftsFromModel()
  void nextTick(() => repositionPanel())
}

function closePanel(): void {
  if (!isPanelOpen.value) return
  isPanelOpen.value = false
}

/* ─────────── Commit ─────────── */

function emitCommit(value: number | [number, number] | null): void {
  emit('update:modelValue', value)
  emit('change', value)
}

function commitSingle(): void {
  // Commit from the cursor (kept in sync on every cell click and keyboard
  // move) — not from dateDraft, so keyboard-moved-but-unconfirmed days
  // confirm exactly what the panel highlights.
  const day = startOfDay(cursor.value)
  const ts = hasTime.value
    ? combineDateTime(day, timeDraft.value.hour, timeDraft.value.minute, timeDraft.value.second)
    : props.type === 'month'
      ? startOfMonthTs(day)
      : props.type === 'year'
        ? startOfYearTs(day)
        : day
  emitCommit(ts)
}

function startOfMonthTs(ms: number): number {
  const p = getDateParts(ms)
  return new Date(p.year, p.month, 1).getTime()
}

function startOfYearTs(ms: number): number {
  const p = getDateParts(ms)
  return new Date(p.year, 0, 1).getTime()
}

function commitRange(): void {
  const { start, end } = rangeDraft.value
  if (start === null || end === null) return
  const s = hasTime.value
    ? combineDateTime(start, rangeTimeDraft.value.start.hour, rangeTimeDraft.value.start.minute, rangeTimeDraft.value.start.second)
    : start
  const e = hasTime.value
    ? combineDateTime(end, rangeTimeDraft.value.end.hour, rangeTimeDraft.value.end.minute, rangeTimeDraft.value.end.second)
    : end
  emitCommit([s, e])
}

function clearValue(): void {
  if (!isInteractive.value) return
  emitCommit(null)
  emit('clear')
  closePanel()
}

/* ─────────── Cell interactions ─────────── */

function onDayCellClick(ts: number): void {
  if (!isInteractive.value) return
  const day = startOfDay(ts)
  cursor.value = day
  if (isRange.value) {
    if (rangeDraft.value.start === null || rangeDraft.value.end !== null) {
      // Fresh pick: start over with the clicked day as start.
      rangeDraft.value = { start: day, end: null }
    } else {
      // Second pick: swap when end < start, then commit.
      const start = rangeDraft.value.start
      const [lo, hi] = day < start ? [day, start] : [start, day]
      rangeDraft.value = { start: lo, end: hi }
      if (hasTime.value) {
        commitRange() // datetimerange keeps the panel open (确认 closes)
      } else {
        commitRange()
        closePanel()
      }
    }
    return
  }
  dateDraft.value = day
  commitSingle()
  if (!hasTime.value) closePanel()
}

function onMonthCellClick(ts: number): void {
  if (!isInteractive.value) return
  cursor.value = ts
  if (props.type === 'month') {
    dateDraft.value = ts
    commitSingle()
    closePanel()
    return
  }
  // date modes: drill back into the day grid anchored at that month.
  viewMode.value = 'day'
  anchorTs.value = ts
}

function onYearCellClick(ts: number): void {
  if (!isInteractive.value) return
  cursor.value = ts
  if (props.type === 'year') {
    dateDraft.value = ts
    commitSingle()
    closePanel()
    return
  }
  viewMode.value = props.type === 'month' ? 'day' : 'month'
  anchorTs.value = ts
}

function onTimeCellClick(side: SnRangeSide, unit: SnTimeUnit, value: number): void {
  if (!isInteractive.value) return
  if (isRange.value) {
    rangeTimeDraft.value[side][unit] = value
    if (rangeDraft.value.start !== null && rangeDraft.value.end !== null) commitRange()
    return
  }
  timeDraft.value[unit] = value
  commitSingle()
}

function confirmAndClose(): void {
  if (!isInteractive.value) return
  if (isRange.value) {
    if (rangeDraft.value.start !== null && rangeDraft.value.end !== null) commitRange()
  } else {
    commitSingle()
  }
  closePanel()
}

/* ─────────── Header navigation ─────────── */

/** Shift anchors by whole months (day view) / years (unit views). */
function shiftAnchor(deltaUnits: number): void {
  const months = viewMode.value === 'day' ? deltaUnits : deltaUnits * 12
  anchorTs.value = addMonths(anchorTs.value, months)
  cursor.value = addMonths(cursor.value, months)
}

function onTitleClick(): void {
  if (viewMode.value === 'day') viewMode.value = 'month'
  else if (viewMode.value === 'month') viewMode.value = 'year'
}

/* ─────────── Keyboard ─────────── */

function stepCursor(deltaDays: number): void {
  cursor.value = startOfDay(cursor.value + deltaDays * 86_400_000)
  // Keep the grid in view when the cursor leaves the anchored month.
  if (viewMode.value === 'day' && !isSameMonth(cursor.value, anchorTs.value)) {
    anchorTs.value = cursor.value
  }
}

function pageCursor(delta: 1 | -1): void {
  const months = viewMode.value === 'day' ? delta : delta * 12
  cursor.value = addMonths(cursor.value, months)
  anchorTs.value = cursor.value
}

function pickCursor(): void {
  const day = startOfDay(cursor.value)
  if (viewMode.value === 'day') {
    onDayCellClick(day)
    return
  }
  if (viewMode.value === 'month') {
    onMonthCellClick(day)
    return
  }
  onYearCellClick(day)
}

function onTriggerKeyDown(event: KeyboardEvent): void {
  if (!isInteractive.value) return
  switch (event.key) {
    case 'Enter': {
      event.preventDefault()
      if (!isPanelOpen.value) {
        openPanel()
        return
      }
      if (hasTime.value) {
        confirmAndClose()
      } else {
        pickCursor()
      }
      break
    }
    case ' ': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      break
    }
    case 'Escape': {
      if (isPanelOpen.value) {
        event.preventDefault()
        closePanel()
      }
      break
    }
    case 'ArrowLeft': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      stepCursor(viewMode.value === 'day' ? -1 : 0)
      if (viewMode.value !== 'day') pageCursor(-1)
      break
    }
    case 'ArrowRight': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      stepCursor(viewMode.value === 'day' ? 1 : 0)
      if (viewMode.value !== 'day') pageCursor(1)
      break
    }
    case 'ArrowUp': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      stepCursor(-7)
      break
    }
    case 'ArrowDown': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      stepCursor(7)
      break
    }
    case 'PageUp': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      pageCursor(-1)
      break
    }
    case 'PageDown': {
      event.preventDefault()
      if (!isPanelOpen.value) openPanel()
      pageCursor(1)
      break
    }
    default:
      break
  }
}

/* ─────────── Trigger events ─────────── */

function onTriggerMouseDown(event: MouseEvent): void {
  // Keep focus on the trigger — no text-selection caret on the wrapper.
  event.preventDefault()
}

function onTriggerClick(): void {
  if (!isInteractive.value) return
  if (isPanelOpen.value) closePanel()
  else openPanel()
}

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  emit('blur', event)
}

/* ─────────── Listeners lifecycle (§41/§42) ─────────── */

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown)
})

watch(() => props.modelValue, () => {
  // External value change while open — keep the panel drafts in sync.
  if (isPanelOpen.value) initDraftsFromModel()
})
</script>

<style scoped>
.sn-date-picker {
  display: inline-flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1;
}

.sn-date-picker__selection {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: var(--sn-web-date-picker-height, 34px);
  padding: 0 var(--sn-web-date-picker-padding-x, 10px);
  width: var(--sn-web-date-picker-width, 100%);
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-date-picker-radius, 6px);
  background-color: var(--sn-web-date-picker-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-date-picker-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  transition: border-color 0.18s ease-out, box-shadow 0.18s ease-out;
  outline: none;
}

.sn-date-picker__selection:focus-visible {
  border-color: var(--sn-web-date-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

.sn-date-picker--active .sn-date-picker__selection {
  border-color: var(--sn-web-date-picker-border-color-focus, var(--sn-web-color-action-primary));
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* Sizes — height + font-size presets (mirror SnSelect / SnTimePicker). */
.sn-date-picker--mini { --sn-web-date-picker-height: 22px; font-size: 11px; }
.sn-date-picker--tiny { --sn-web-date-picker-height: 24px; font-size: 12px; }
.sn-date-picker--small { --sn-web-date-picker-height: 28px; font-size: 13px; }
.sn-date-picker--medium { --sn-web-date-picker-height: 32px; font-size: 14px; }
.sn-date-picker--large { --sn-web-date-picker-height: 40px; font-size: 15px; }

.sn-date-picker__value,
.sn-date-picker__placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: inherit;
  font-variant-numeric: tabular-nums;
}

.sn-date-picker__placeholder {
  color: var(--sn-web-date-picker-placeholder-color, var(--sn-web-color-text-tertiary));
}

.sn-date-picker__separator {
  color: var(--sn-web-date-picker-separator-color, var(--sn-web-color-text-tertiary));
}

/* Suffix: clear / arrow */
.sn-date-picker__suffix {
  position: absolute;
  right: var(--sn-web-date-picker-suffix-right, 8px);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.sn-date-picker__suffix > * {
  pointer-events: auto;
}

.sn-date-picker__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-date-picker-clear-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
}

.sn-date-picker__clear:hover {
  color: var(--sn-web-date-picker-clear-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-color-background-subtle);
}

.sn-date-picker__arrow {
  display: inline-flex;
  align-items: center;
  color: var(--sn-web-date-picker-arrow-color, var(--sn-web-color-text-tertiary));
  transition: transform 0.18s ease-out;
}

.sn-date-picker__arrow--up {
  transform: rotate(180deg);
}

/* Disabled / readonly */
.sn-date-picker--disabled .sn-date-picker__selection {
  cursor: not-allowed;
  background-color: var(--sn-web-date-picker-bg-disabled, var(--sn-web-color-background-subtle));
  color: var(--sn-web-date-picker-text-color-disabled, var(--sn-web-color-text-disabled));
  border-color: var(--sn-web-date-picker-border-color-disabled, var(--sn-web-color-border-subtle));
}

.sn-date-picker--disabled .sn-date-picker__placeholder {
  color: var(--sn-web-date-picker-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-date-picker--readonly .sn-date-picker__selection {
  cursor: default;
  background-color: var(--sn-web-date-picker-bg-readonly, var(--sn-web-color-background-subtle));
}

/* Status */
.sn-date-picker--status-error .sn-date-picker__selection {
  border-color: var(--sn-web-color-feedback-danger);
}

.sn-date-picker--status-warning .sn-date-picker__selection {
  border-color: var(--sn-web-color-feedback-warning);
}

/* Suffix overlap guard: leave room for the arrow / clear button. */
.sn-date-picker__selection {
  padding-right: calc(var(--sn-web-date-picker-padding-x, 10px) + 22px);
}
</style>

<style scoped>
/* Date panel — teleported to body, so it lives in its own (non-scoped-alias)
 * style block, mirroring the SnSelect / SnTimePicker convention. Teleported
 * nodes still receive the scoped attribute, so both blocks stay in this SFC. */
.sn-date-picker-panel {
  position: fixed;
  z-index: var(--sn-web-date-picker-panel-z-index, 1000);
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid var(--sn-web-date-picker-panel-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-date-picker-panel-radius, 6px);
  background-color: var(
    --sn-web-date-picker-panel-bg,
    var(--sn-web-color-background-elevated)
  );
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 6px 18px rgba(0, 0, 0, 0.14);
  font-family: inherit;
  font-size: var(--sn-web-date-picker-panel-font-size, 13px);
  animation: sn-date-picker-panel-in 0.15s ease-out;
}

@keyframes sn-date-picker-panel-in {
  from {
    opacity: 0;
    transform: scaleY(0.94);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.sn-date-picker-panel__calendars {
  display: flex;
  gap: 12px;
}

.sn-date-picker-calendar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sn-date-picker-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
}

.sn-date-picker-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-date-picker-nav-radius, 4px);
  background: transparent;
  color: var(--sn-web-date-picker-nav-color, var(--sn-web-color-text-secondary));
  cursor: pointer;
}

.sn-date-picker-nav:hover {
  background-color: var(--sn-web-date-picker-nav-bg-hover, var(--sn-web-color-background-subtle));
}

.sn-date-picker-calendar__title {
  flex: 1;
  padding: 2px 4px;
  border: none;
  border-radius: var(--sn-web-date-picker-nav-radius, 4px);
  background: transparent;
  color: var(--sn-web-date-picker-title-color, var(--sn-web-color-text-primary));
  font-size: inherit;
  font-weight: 500;
  cursor: pointer;
}

.sn-date-picker-calendar__title:hover {
  background-color: var(--sn-web-date-picker-nav-bg-hover, var(--sn-web-color-background-subtle));
}

/* Day grid */
.sn-date-picker-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sn-date-picker-grid__row {
  display: flex;
  gap: 2px;
}

.sn-date-picker-grid__weekday {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-date-picker-cell-size, 28px);
  height: 22px;
  color: var(--sn-web-date-picker-weekday-color, var(--sn-web-color-text-tertiary));
  font-weight: 400;
}

.sn-date-picker-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-date-picker-cell-size, 28px);
  height: var(--sn-web-date-picker-cell-size, 28px);
  border-radius: var(--sn-web-date-picker-cell-radius, 4px);
  color: var(--sn-web-date-picker-cell-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.12s ease-out, color 0.12s ease-out;
}

.sn-date-picker-cell:hover {
  background-color: var(--sn-web-date-picker-cell-bg-hover, var(--sn-web-color-background-subtle));
}

.sn-date-picker-cell--other-month {
  color: var(--sn-web-date-picker-cell-color-other-month, var(--sn-web-color-text-disabled));
}

.sn-date-picker-cell--cursor:not(.sn-date-picker-cell--selected):not(.sn-date-picker-cell--start):not(.sn-date-picker-cell--end) {
  box-shadow: inset 0 0 0 1px var(--sn-web-date-picker-cursor-border, var(--sn-web-color-action-primary));
}

.sn-date-picker-cell--selected,
.sn-date-picker-cell--start,
.sn-date-picker-cell--end {
  background-color: var(
    --sn-web-date-picker-cell-bg-selected,
    var(--sn-web-color-action-primary)
  );
  color: var(
    --sn-web-date-picker-cell-text-color-selected,
    var(--sn-web-color-text-on-primary)
  );
}

.sn-date-picker-cell--selected:hover,
.sn-date-picker-cell--start:hover,
.sn-date-picker-cell--end:hover {
  background-color: var(
    --sn-web-date-picker-cell-bg-selected-hover,
    var(--sn-web-color-action-primary-hover)
  );
}

.sn-date-picker-cell--in-range {
  background-color: var(
    --sn-web-date-picker-cell-bg-in-range,
    var(--sn-web-color-action-primary-soft)
  );
}

.sn-date-picker-cell--unit {
  width: var(--sn-web-date-picker-unit-cell-size, 52px);
}

/* Datetime columns */
.sn-date-picker-panel__time {
  display: flex;
  gap: 2px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__time--range {
  gap: 12px;
}

.sn-date-picker-time-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sn-date-picker-time-group__label {
  color: var(--sn-web-date-picker-time-label-color, var(--sn-web-color-text-tertiary));
  font-size: 11px;
}

.sn-date-picker-time-col {
  width: var(--sn-web-date-picker-time-col-width, 56px);
  height: var(--sn-web-date-picker-time-col-height, 180px);
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: var(--sn-web-date-picker-time-col-radius, 4px);
  scrollbar-width: none;
}

.sn-date-picker-time-col::-webkit-scrollbar {
  display: none;
}

.sn-date-picker-time-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--sn-web-date-picker-time-item-height, 30px);
  border-radius: var(--sn-web-date-picker-time-item-radius, 4px);
  color: var(--sn-web-date-picker-time-item-color, var(--sn-web-color-text-primary));
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  user-select: none;
}

.sn-date-picker-time-item:hover {
  background-color: var(--sn-web-date-picker-time-item-bg-hover, var(--sn-web-color-background-subtle));
}

.sn-date-picker-time-item--selected {
  background-color: var(
    --sn-web-date-picker-time-item-bg-selected,
    var(--sn-web-color-action-primary)
  );
  color: var(
    --sn-web-date-picker-time-item-text-color-selected,
    var(--sn-web-color-text-on-primary)
  );
}

/* Footer */
.sn-date-picker-panel__footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--sn-web-date-picker-panel-divider, var(--sn-web-color-border-subtle));
}

.sn-date-picker-panel__confirm {
  padding: 4px 12px;
  border: none;
  border-radius: var(--sn-web-date-picker-confirm-radius, 4px);
  background-color: var(
    --sn-web-date-picker-confirm-bg,
    var(--sn-web-color-action-primary)
  );
  color: var(
    --sn-web-date-picker-confirm-text-color,
    var(--sn-web-color-text-on-primary)
  );
  font-size: inherit;
  cursor: pointer;
}

.sn-date-picker-panel__confirm:hover {
  background-color: var(
    --sn-web-date-picker-confirm-bg-hover,
    var(--sn-web-color-action-primary-hover)
  );
}
</style>
