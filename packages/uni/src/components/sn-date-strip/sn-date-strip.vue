<script setup lang="ts">
/**
 * sn-date-strip (uni-end) — 横向日期条。
 *
 * AUI 追加组件（additive，AGENTS.md §112.3a）：wot-ui / naive-ui 均无同型
 * 组件，无 1:1 参考面。API 风格对齐库内 `sn-calendar-view`（值模型、
 * formatter 钩子、--sn-mp-* token、rpx 几何），行为参照酒店 / 价格日历类
 * 业务的横向日期选择条。
 *
 * ## Composition
 *
 * 一条横向滚动的日期列：每列 = 星期字（顶）+ 日号（中）+ 自定义文案（底）。
 * `single` 点选即写值；`range` 首点定起点、再点定终点（与 sn-calendar-view
 * 的区间语义一致，越界自动交换）。值是本地零点毫秒时间戳。
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 月份网格 / 弹层 — 用 sn-calendar-view / sn-calendar
 *   - 滚筒选择 — 用 sn-datetime-picker
 */

import { computed } from 'vue';
import type { DateStripDayItem } from './sn-date-strip-types';

defineOptions({ name: 'SnDateStrip' });

/** Cell state for styling. */
type DateStripDayType = '' | 'selected' | 'start' | 'end' | 'middle';

const props = withDefaults(
  defineProps<{
    /** 选中值：时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）。 */
    modelValue?: number | number[] | null;
    /** 选择模式。 */
    type?: 'single' | 'range';
    /** 条内天数。 */
    count?: number;
    /** 条起点（本地零点），默认今天。 */
    startDate?: number | undefined;
    /** 早于该日（时间戳）的格子禁用。 */
    minDate?: number | undefined;
    /** 晚于该日（时间戳）的格子禁用。 */
    maxDate?: number | undefined;
    /** 显示顶部星期行。 */
    showWeek?: boolean;
    /** 格子钩子：改写 text / topInfo / bottomInfo / disabled。 */
    formatter?: ((item: DateStripDayItem) => DateStripDayItem) | undefined;
    /** 整条禁用。 */
    disabled?: boolean;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    modelValue: null,
    type: 'single',
    count: 7,
    startDate: undefined,
    minDate: undefined,
    maxDate: undefined,
    showWeek: true,
    formatter: undefined,
    disabled: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[]): void;
  (e: 'change', payload: { value: number | number[] }): void;
}>();

/** Start of day for a timestamp. */
function startOfDay(timestamp: number): number {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** First day of the strip (local midnight), default today. */
const stripStart = computed(() => startOfDay(props.startDate ?? Date.now()));

/** Rendered cells between `stripStart` and `stripStart + count - 1`. */
const days = computed<DateStripDayItem[]>(() => {
  const total = Math.max(Math.trunc(props.count), 1);
  const list: DateStripDayItem[] = [];
  for (let index = 0; index < total; index += 1) {
    const date = stripStart.value + index * 86400000;
    const d = new Date(date);
    const item: DateStripDayItem = {
      date,
      day: d.getDate(),
      week: d.getDay(),
      text: String(d.getDate()),
      topInfo: '',
      bottomInfo: '',
      disabled:
        props.disabled || date < startOfDay(props.minDate ?? date) || date > startOfDay(props.maxDate ?? date),
    };
    const formatted = props.formatter ? props.formatter(item) : undefined;
    list.push({
      ...item,
      text: formatted?.text ?? item.text,
      topInfo: formatted?.topInfo ?? item.topInfo,
      bottomInfo: formatted?.bottomInfo ?? item.bottomInfo,
      disabled: formatted?.disabled ?? item.disabled,
    });
  }
  return list;
});

/* ── Selection model ───────────────────────────────────────────────────── */

const isRange = computed(() => props.type === 'range');

/** Selection normalized to a `[start, end]` pair; pending ranges are `[s]`. */
const selection = computed<number[]>(() => {
  const value = props.modelValue;
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'number').slice();
  return [value];
});

function stateOf(date: number): DateStripDayType {
  const values = selection.value;
  if (values.length === 0) return '';
  if (isRange.value) {
    const [start, end] = values;
    if (start === undefined) return '';
    if (end === undefined || start === end) return date === start ? 'selected' : '';
    if (date === start) return 'start';
    if (date === end) return 'end';
    if (date > start && date < end) return 'middle';
    return '';
  }
  return date === values[0] ? 'selected' : '';
}

function onCellTap(item: DateStripDayItem): void {
  if (item.disabled) return;
  const date = item.date;
  if (!isRange.value) {
    if (selection.value[0] === date) return;
    commitValue(date);
    return;
  }
  const [start, end] = selection.value;
  // 无起点或区间已成 → 重新起头；进行中 → 收尾（越界自动交换）。
  if (start === undefined || (end !== undefined && start !== end)) {
    commitValue([date]);
    return;
  }
  if (start === date) return;
  const [from, to] = date < start ? [date, start] : [start, date];
  commitValue([from, to]);
}

function commitValue(next: number | number[]): void {
  emit('update:modelValue', next);
  emit('change', { value: next });
}

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-date-strip',
  `sn-date-strip--${props.type}`,
  {
    'sn-date-strip--no-week': !props.showWeek,
    'sn-date-strip--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle || undefined);

function cellClass(item: DateStripDayItem): Record<string, boolean> {
  const type = item.disabled ? '' : stateOf(item.date);
  return {
    'sn-date-strip__num--selected': type === 'selected' || type === 'start' || type === 'end',
    'sn-date-strip__num--middle': type === 'middle',
  };
}

function dayClass(item: DateStripDayItem): Record<string, boolean> {
  return {
    'sn-date-strip__day--weekend': item.week === 0 || item.week === 6,
    'sn-date-strip__day--disabled': item.disabled,
  };
}

function weekdayLabel(item: DateStripDayItem): string {
  return WEEK_LABELS[item.week] ?? '';
}
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'date-strip'"
    role="group"
    :aria-label="'date strip'"
  >
    <scroll-view class="sn-date-strip__scroll" scroll-x>
      <view class="sn-date-strip__row">
        <view
          v-for="item in days"
          :key="item.date"
          :class="['sn-date-strip__day', dayClass(item)]"
          role="button"
          :aria-label="`${item.text} 日`"
          :aria-disabled="item.disabled ? 'true' : undefined"
          :aria-selected="cellClass(item)['sn-date-strip__num--selected'] ? 'true' : 'false'"
          :tabindex="item.disabled ? -1 : 0"
          @tap="onCellTap(item)"
        >
          <text v-if="showWeek" class="sn-date-strip__week">{{ weekdayLabel(item) }}</text>
          <view
            :class="['sn-date-strip__num', cellClass(item)]"
          >
            <text v-if="item.topInfo" class="sn-date-strip__info sn-date-strip__info--top">{{
              item.topInfo
            }}</text>
            <text class="sn-date-strip__text">{{ item.text }}</text>
            <text v-if="item.bottomInfo" class="sn-date-strip__info">{{
              item.bottomInfo
            }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-date-strip {
  display: block;
  width: 100%;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-date-strip__scroll {
  width: 100%;
}

.sn-date-strip__row {
  display: flex;
  min-width: 100%;
}

.sn-date-strip__day {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  width: 96rpx;
  padding: var(--sn-mp-spacing-2) 0;
  box-sizing: border-box;
}

.sn-date-strip__week {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-date-strip__num {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 72rpx;
  min-height: 72rpx;
  padding: var(--sn-mp-spacing-1);
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-md);
}

.sn-date-strip__text {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  line-height: 1.2;
}

.sn-date-strip__info {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1.2;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-date-strip__day--weekend .sn-date-strip__week,
.sn-date-strip__day--weekend .sn-date-strip__text {
  color: var(--sn-mp-color-feedback-error);
}

.sn-date-strip__num--selected {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-date-strip__num--selected .sn-date-strip__info {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-date-strip__num--middle {
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
}

.sn-date-strip__day--disabled {
  opacity: 0.45;
}

.sn-date-strip--disabled {
  opacity: 0.45;
}

/* Doodle skin — hand-drawn selection outline. */
.snui-skin-doodle .sn-date-strip__num--selected {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
