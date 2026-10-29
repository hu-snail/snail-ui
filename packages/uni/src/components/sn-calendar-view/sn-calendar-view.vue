<script setup lang="ts">
/**
 * sn-calendar-view (uni-end) — scrollable month-grid calendar body.
 *
 * Reference library: wot-ui `wd-calendar-view`
 *   (https://wot-ui.cn/component/calendar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-calendar-view 1:1
 * except for the documented omissions below. Anything new added here MUST
 * also be added to the reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-calendar-view/sn-calendar-view.vue
 * → auto-registered as `<sn-calendar-view>` in any .vue that uses it.
 *
 * ## Documented omissions (CONTRIBUTING §9 — no half-built props)
 *
 *   - `week` / `weekrange` types are not offered. The prop union simply does
 *     not include them; the docs page marks them 「未实现」.
 *   - `time-filter`, `time-item-height`, `time-visible-item-count` and
 *     `hide-second` are declared for wd-calendar-view parity (name / type /
 *     default all match the spec) but have no rendering effect: the panel
 *     renders no time roller. `datetime` / `datetimerange` still default the
 *     clock time to `default-time`. Docs mark them 「声明但未实现」.
 *
 * ## Additive
 *
 *   - `show-lunar` (AGENTS.md §112.3a): renders a lunar caption under each
 *     day cell (lunar day name; the month name on 初一). `formatter` wins
 *     over the lunar text. Conversion is the shared pure `utils/sn-lunar`.
 *
 * ## Rendering
 *
 * One `<view>` month grid per month between `minDate` and `maxDate`, laid out
 * as a 7-column flex grid inside a `<scroll-view>`. Geometry is `rpx`; colors
 * are `--sn-mp-*` only. No `ResizeObserver`, no timer, no global listener —
 * nothing to dispose (AGENTS.md §41).
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 弹层 / 确认按钮 / 快捷选项 — 用 sn-calendar
 *   - 时间滚筒 — 用 sn-datetime-picker-view
 */

import { computed, ref } from 'vue';
import type {
  CalendarDayItem,
  CalendarDayType,
  CalendarFormatter,
  CalendarTimeFilter,
  CalendarType,
  CalendarValue,
} from './sn-calendar-view-types';
import {
  daysInMonth,
  fromParts,
  startOfDay,
  toParts,
  weekdayOf,
} from '../sn-datetime-picker-view/sn-datetime-picker-view-utils';
import { lunarDayLabel } from '../../utils/sn-lunar';

defineOptions({ name: 'SnCalendarView' });

/** One rendered cell. */
interface Cell {
  /** Local midnight timestamp. */
  date: number;
  /** Day number. */
  day: number;
  /** Cell state. */
  type: CalendarDayType;
  /** Rendered text. */
  text: string;
  /** Caption above. */
  topInfo: string;
  /** Caption below. */
  bottomInfo: string;
  /** Disabled state. */
  disabled: boolean;
  /** Out-of-month filler cell (rendered blank). */
  filler: boolean;
}

/** One rendered month. */
interface MonthBlock {
  /** `YYYY-MM` key. */
  key: string;
  /** Panel title (`2024 年 6 月`). */
  title: string;
  /** Year. */
  year: number;
  /** Month (1-based). */
  month: number;
  /** Cells, `weeks * 7` entries (leading / trailing fillers included). */
  cells: Cell[];
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-calendar-view` 1:1 surface ──────────────────────────── */

    /** Selected value — a timestamp, a timestamp list, or `null`. */
    modelValue?: CalendarValue;
    /** Selection mode. */
    type?: CalendarType;
    /** Minimum date (timestamp). */
    minDate?: number | undefined;
    /** Maximum date (timestamp). */
    maxDate?: number | undefined;
    /** First weekday of the grid (0 = Sunday). */
    firstDayOfWeek?: number;
    /** Cell formatter hook. */
    formatter?: CalendarFormatter | undefined;
    /** Maximum span for the range types (in days). `0` = unconstrained. */
    maxRange?: number;
    /** Message shown when `maxRange` is exceeded. */
    rangePrompt?: string;
    /** Allow the range start and end to be the same day. */
    allowSameDay?: boolean;
    /** Render the per-month panel title. */
    showPanelTitle?: boolean;
    /** Default clock time applied to date / datetime values. */
    defaultTime?: string | string[];
    /** Scrollable panel height in px design units. */
    panelHeight?: number;
    /** Emit `change` as soon as a cell is tapped. */
    immediateChange?: boolean;
    /** Month-switch mode. `none` renders every month flat. */
    switchMode?: 'none' | 'month' | 'year-month';
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
    /**
     * Time-column filter hook (`wd-calendar-view` `time-filter`).
     * Declared for parity; this build renders no time roller, so the hook is
     * never invoked. Documented as 「未实现」.
     */
    timeFilter?: CalendarTimeFilter | undefined;
    /** Time row height (`wd-calendar-view` `time-item-height`). Declared for parity. */
    timeItemHeight?: number;
    /** Visible time rows (`wd-calendar-view` `time-visible-item-count`). Declared for parity. */
    timeVisibleItemCount?: number;
    /** Hide the seconds column (`wd-calendar-view` `hide-second`). Declared for parity. */
    hideSecond?: boolean;
    /**
     * 农历角标（additive，AGENTS.md §112.3a）：在格子下方显示农历日名
     * （初二、十五…），初一显示月名（正月 / 闰六月）。`formatter` 的
     * `bottomInfo` 优先级更高，可覆盖农历文案。
     */
    showLunar?: boolean;
  }>(),
  {
    modelValue: null,
    type: 'date',
    minDate: undefined,
    maxDate: undefined,
    firstDayOfWeek: 0,
    formatter: undefined,
    maxRange: 0,
    rangePrompt: '',
    allowSameDay: false,
    showPanelTitle: true,
    defaultTime: '00:00:00',
    panelHeight: 316,
    immediateChange: false,
    switchMode: 'none',
    customClass: '',
    customStyle: '',
    timeFilter: undefined,
    timeItemHeight: 44,
    timeVisibleItemCount: 6,
    hideSecond: false,
    showLunar: false,
  },
);
const emit = defineEmits<{
  (e: 'update:modelValue', value: CalendarValue): void;
  (e: 'change', payload: { value: CalendarValue }): void;
  (e: 'pickstart'): void;
  (e: 'pickend'): void;
}>();

/* ── Bounds ────────────────────────────────────────────────────────────── */

const MONTH_SPAN = 6;

const now = startOfDay(Date.now());

const minTimestamp = computed(() => {
  if (props.minDate !== undefined) return startOfDay(props.minDate);
  const d = new Date(now);
  d.setMonth(d.getMonth() - MONTH_SPAN, 1);
  return startOfDay(d.getTime());
});

const maxTimestamp = computed(() => {
  if (props.maxDate !== undefined) return startOfDay(props.maxDate);
  const d = new Date(now);
  d.setMonth(d.getMonth() + MONTH_SPAN + 1, 0);
  return startOfDay(d.getTime());
});

/* ── Selection model ───────────────────────────────────────────────────── */

const isRangeType = computed(
  () => props.type === 'daterange' || props.type === 'datetimerange' || props.type === 'monthrange',
);

const isMultipleType = computed(() => props.type === 'dates');

const isMonthType = computed(() => props.type === 'month' || props.type === 'monthrange');

const isDatetimeType = computed(() => props.type === 'datetime' || props.type === 'datetimerange');

/** Selection normalized to a `[start, end]` pair (single types use `[v, v]`). */
const selection = computed<number[]>(() => {
  const value = props.modelValue;
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'number').slice();
  return [value];
});

/** Apply `defaultTime` to a midnight timestamp. */
const defaultTimeParts = computed(() => {
  const raw = Array.isArray(props.defaultTime) ? props.defaultTime[0] : props.defaultTime;
  const match = /^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/.exec(raw ?? '');
  return {
    hour: match ? Number(match[1] ?? 0) : 0,
    minute: match ? Number(match[2] ?? 0) : 0,
    second: match ? Number(match[3] ?? 0) : 0,
  };
});

function withDefaultTime(timestamp: number): number {
  const parts = toParts(timestamp);
  const time = defaultTimeParts.value;
  return fromParts({ ...parts, hour: time.hour, minute: time.minute, second: time.second });
}

/* ── Month grid ────────────────────────────────────────────────────────── */

function monthKey(year: number, month: number): string {
  return `${year}-${month < 10 ? `0${month}` : month}`;
}

/** Month blocks between the min and max bounds (inclusive). */
const months = computed<MonthBlock[]>(() => {
  const min = toParts(minTimestamp.value);
  const max = toParts(maxTimestamp.value);
  const blocks: MonthBlock[] = [];
  let year = min.year;
  let month = min.month;
  while (year < max.year || (year === max.year && month <= max.month)) {
    blocks.push({
      key: monthKey(year, month),
      title: `${year} 年 ${month} 月`,
      year,
      month,
      cells: [],
    });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return blocks;
});

/** Classify one in-month day. */
function stateOf(date: number): CalendarDayType {
  const values = selection.value;
  if (values.length === 0) return '';
  if (isRangeType.value) {
    const [start, end] = values;
    if (start === undefined) return '';
    if (end === undefined || start === end) {
      return date === start ? 'selected' : '';
    }
    if (date === start) return 'start';
    if (date === end) return 'end';
    if (date > start && date < end) return 'middle';
    return '';
  }
  if (isMultipleType.value) {
    if (values.includes(date)) return 'multiple-selected';
    return '';
  }
  if (isMonthType.value) {
    return values.includes(date) ? 'selected' : '';
  }
  return date === values[0] ? 'selected' : '';
}

/** Build the cells for one month block. */
function buildCells(block: MonthBlock): Cell[] {
  const total = daysInMonth(block.year, block.month);
  const firstWeekday = weekdayOf(block.year, block.month, 1);
  const lead = (firstWeekday - props.firstDayOfWeek + 7) % 7;
  const cells: Cell[] = [];
  const min = minTimestamp.value;
  const max = maxTimestamp.value;
  const today = now;

  const push = (date: number, day: number, filler: boolean): void => {
    const type = filler ? '' : stateOf(date);
    const disabled = filler ? true : date < min || date > max;
    const item: CalendarDayItem = {
      date,
      type,
      text: String(day),
      topInfo: '',
      bottomInfo: '',
      disabled,
    };
    // 农历角标（additive）：先铺农历文案，formatter 仍可覆盖。
    if (!filler && props.showLunar) item.bottomInfo = lunarDayLabel(date);
    const formatted = props.formatter && !filler ? props.formatter(item) : undefined;
    cells.push({
      date,
      day,
      type: formatted?.type ?? type,
      text: formatted?.text ?? item.text,
      topInfo: formatted?.topInfo ?? '',
      bottomInfo: formatted?.bottomInfo ?? item.bottomInfo,
      disabled: formatted?.disabled ?? disabled,
      filler,
    });
  };

  for (let i = 0; i < lead; i += 1) push(0, 0, true);
  for (let day = 1; day <= total; day += 1) {
    const date = startOfDay(new Date(block.year, block.month - 1, day).getTime());
    push(date, day, false);
    if (date === today) {
      // Mark "today" so the CSS can ring it. `type` stays the selection state;
      // the ring is a separate class driven by `date`.
    }
  }
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    for (let i = remainder; i < 7; i += 1) push(0, 0, true);
  }
  return cells;
}

const monthBlocks = computed<MonthBlock[]>(() =>
  months.value.map((block) => ({ ...block, cells: buildCells(block) })),
);

/* ── Selection writes ──────────────────────────────────────────────────── */

function commitValue(next: CalendarValue): void {
  emit('update:modelValue', next);
  emit('change', { value: next });
}

/** Range span in days (inclusive). */
function spanDays(start: number, end: number): number {
  return Math.round((startOfDay(end) - startOfDay(start)) / 86400000) + 1;
}

function onCellTap(cell: Cell): void {
  if (cell.filler || cell.disabled) return;
  const date = cell.date;
  const values = selection.value;

  if (isMultipleType.value) {
    const next = values.includes(date) ? values.filter((v) => v !== date) : [...values, date];
    next.sort((a, b) => a - b);
    commitValue(next);
    return;
  }

  if (isRangeType.value) {
    const [start, end] = values;
    if (start === undefined || (end !== undefined && start !== end)) {
      commitValue([date]);
      return;
    }
    if (start === date && props.allowSameDay) {
      commitValue([date, date]);
      return;
    }
    const [from, to] = date < start ? [date, start] : [start, date];
    // A zero-length range is only legal when `allowSameDay` is set — otherwise
    // re-tapping the pending start must not close the range on itself.
    if (!props.allowSameDay && from === to) return;
    if (props.maxRange > 0 && spanDays(from, to) > props.maxRange) return;
    commitValue([from, to]);
    return;
  }

  commitValue(withDefaultTime(date));
}

/* ── Navigation (month / year-month switch modes) ──────────────────────── */

const activeMonthIndex = ref(0);

/** `scroll-into-view` target for the active month. */
const scrollIntoViewId = computed(() => {
  if (props.switchMode === 'none') return '';
  const block = monthBlocks.value[activeMonthIndex.value];
  return block ? `sn-calendar-view-month-${block.key}` : '';
});

function shiftMonth(delta: number): void {
  const next = activeMonthIndex.value + delta;
  if (next < 0 || next >= monthBlocks.value.length) return;
  activeMonthIndex.value = next;
}

function shiftYear(delta: number): void {
  const current = monthBlocks.value[activeMonthIndex.value];
  if (!current) return;
  const targetYear = current.year + delta;
  const index = monthBlocks.value.findIndex(
    (block) => block.year === targetYear && block.month === current.month,
  );
  if (index < 0) return;
  activeMonthIndex.value = index;
}

function jumpToToday(): void {
  const todayParts = toParts(now);
  const index = monthBlocks.value.findIndex(
    (block) => block.year === todayParts.year && block.month === todayParts.month,
  );
  if (index >= 0) activeMonthIndex.value = index;
}

defineExpose({ shiftMonth, shiftYear, jumpToToday });

/* ── Presentation ──────────────────────────────────────────────────────── */

const RATIO = 2;

const panelHeightRpx = computed(() => `${Math.max(props.panelHeight, 1) * RATIO}rpx`);

/** Months actually rendered: every block in `none`, the active one otherwise. */
const visibleBlocks = computed<MonthBlock[]>(() => {
  if (props.switchMode === 'none') return monthBlocks.value;
  const block = monthBlocks.value[activeMonthIndex.value];
  return block ? [block] : [];
});

const rootClass = computed(() => [
  'sn-calendar-view',
  `sn-calendar-view--${props.type}`,
  {
    'sn-calendar-view--switch': props.switchMode !== 'none',
    'sn-calendar-view--is-datetime': isDatetimeType.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle || undefined);

const panelStyle = computed(() => ({ height: panelHeightRpx.value }));

function cellClass(cell: Cell): Record<string, boolean> {
  return {
    'sn-calendar-view__day--filler': cell.filler,
    'sn-calendar-view__day--disabled': cell.disabled,
    'sn-calendar-view__day--today': !cell.filler && cell.date === now,
    'sn-calendar-view__day--selected':
      cell.type === 'selected' ||
      cell.type === 'start' ||
      cell.type === 'end' ||
      cell.type === 'same' ||
      cell.type === 'multiple-selected',
    'sn-calendar-view__day--middle': cell.type === 'middle' || cell.type === 'multiple-middle',
    'sn-calendar-view__day--start': cell.type === 'start',
    'sn-calendar-view__day--end': cell.type === 'end',
  };
}

function cellAriaSelected(cell: Cell): 'true' | 'false' {
  return cellClass(cell)['sn-calendar-view__day--selected'] ? 'true' : 'false';
}

/** Weekday headers, rotated by `firstDayOfWeek`. */
const weekLabels = computed(() => {
  const base = ['日', '一', '二', '三', '四', '五', '六'];
  const offset = ((props.firstDayOfWeek % 7) + 7) % 7;
  return [...base.slice(offset), ...base.slice(0, offset)];
});

const rangeHint = computed(() => (props.maxRange > 0 ? props.rangePrompt : ''));
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'calendar-view'"
    role="group"
    :aria-label="type"
  >
    <view v-if="switchMode !== 'none'" class="sn-calendar-view__controls">
      <view
        class="sn-calendar-view__control sn-calendar-view__control--prev"
        role="button"
        aria-label="previous"
        @tap="shiftMonth(-1)"
        ><text>‹</text></view
      >
      <text class="sn-calendar-view__control-title">
        {{ monthBlocks[activeMonthIndex]?.title ?? '' }}
      </text>
      <view
        v-if="switchMode === 'year-month'"
        class="sn-calendar-view__control sn-calendar-view__control--next-year"
        role="button"
        aria-label="next year"
        @tap="shiftYear(1)"
        ><text>»</text></view
      >
      <view
        class="sn-calendar-view__control sn-calendar-view__control--next"
        role="button"
        aria-label="next"
        @tap="shiftMonth(1)"
        ><text>›</text></view
      >
    </view>

    <view class="sn-calendar-view__weeks" aria-hidden="true">
      <text v-for="label in weekLabels" :key="label" class="sn-calendar-view__week">{{
        label
      }}</text>
    </view>

    <scroll-view
      class="sn-calendar-view__panel"
      :style="panelStyle"
      scroll-y
      :scroll-into-view="scrollIntoViewId"
    >
      <view
        v-for="block in visibleBlocks"
        :id="`sn-calendar-view-month-${block.key}`"
        :key="block.key"
        class="sn-calendar-view__month"
      >
        <text v-if="showPanelTitle" class="sn-calendar-view__month-title">{{ block.title }}</text>
        <view class="sn-calendar-view__grid">
          <view
            v-for="(cell, index) in block.cells"
            :key="`${block.key}-${index}`"
            :class="['sn-calendar-view__day', cellClass(cell)]"
            role="button"
            :aria-label="cell.filler ? '' : cell.text"
            :aria-selected="cellAriaSelected(cell)"
            :aria-disabled="cell.disabled ? 'true' : undefined"
            :tabindex="cell.filler || cell.disabled ? -1 : 0"
            @tap="onCellTap(cell)"
          >
            <text
              v-if="cell.topInfo"
              class="sn-calendar-view__day-info sn-calendar-view__day-info--top"
            >
              {{ cell.topInfo }}
            </text>
            <text class="sn-calendar-view__day-text">{{ cell.filler ? '' : cell.text }}</text>
            <text
              v-if="cell.bottomInfo"
              class="sn-calendar-view__day-info sn-calendar-view__day-info--bottom"
            >
              {{ cell.bottomInfo }}
            </text>
          </view>
        </view>
      </view>
    </scroll-view>

    <text v-if="rangeHint" class="sn-calendar-view__hint">{{ rangeHint }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-calendar-view {
  display: block;
  width: 100%;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-calendar-view__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}

.sn-calendar-view__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: var(--sn-mp-radius-md);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-lg);
}

.sn-calendar-view__control-title {
  flex: 1 1 auto;
  text-align: center;
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-calendar-view__weeks {
  display: flex;
  align-items: center;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3) 0;
}

.sn-calendar-view__week {
  flex: 1 1 0;
  text-align: center;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-calendar-view__panel {
  padding: 0 var(--sn-mp-spacing-3) var(--sn-mp-spacing-3);
  box-sizing: border-box;
}

.sn-calendar-view__month {
  padding-top: var(--sn-mp-spacing-3);
}

.sn-calendar-view__month-title {
  display: block;
  padding: var(--sn-mp-spacing-2) 0;
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}

.sn-calendar-view__grid {
  display: flex;
  flex-wrap: wrap;
}

.sn-calendar-view__day {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 14.2857%;
  height: 88rpx;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-md);
  color: var(--sn-mp-color-text-primary);
}

.sn-calendar-view__day-text {
  font-size: var(--sn-mp-font-size-md);
  line-height: 1.2;
}

.sn-calendar-view__day-info {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1.2;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-calendar-view__day--filler {
  color: transparent;
}

.sn-calendar-view__day--disabled {
  color: var(--sn-mp-color-text-disabled);
}

.sn-calendar-view__day--today .sn-calendar-view__day-text {
  font-weight: var(--sn-mp-font-weight-bold);
}

.sn-calendar-view__day--today {
  border: 2rpx solid var(--sn-mp-color-border-default);
}

.sn-calendar-view__day--selected {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-calendar-view__day--selected .sn-calendar-view__day-info {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-calendar-view__day--middle {
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  border-radius: 0;
}

.sn-calendar-view__hint {
  display: block;
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-feedback-warning);
}

/* Doodle skin — hand-drawn cell outline. */
.snui-skin-doodle .sn-calendar-view__day--selected {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
