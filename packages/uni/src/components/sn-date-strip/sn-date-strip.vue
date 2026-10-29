<script setup lang="ts">
/**
 * sn-date-strip (uni-end) — 横向日期条（swiper 分页）。
 *
 * AUI 追加组件（additive，AGENTS.md §112.3a）：wot-ui / naive-ui 均无同型
 * 组件，无 1:1 参考面。API 风格对齐库内 `sn-calendar-view`（值模型、
 * formatter 钩子、--sn-mp-* token、rpx 几何）。
 *
 * ## Composition
 *
 * 一条横向 `swiper` 分页的日期条：每页 `count` 天，每列 = 星期字（顶）+
 * 日号（中）+ 自定义文案（底，如价格 / 农历），点整列即选中（高亮盖住
 * 星期 + 日号整列）。翻页三种方式：手势横滑（swiper）、两侧导航按钮
 * （`show-nav`，内容可用 `#prev` / `#next` 插槽自定义）、`prev()` /
 * `next()` / `jumpTo()` 方法。页序号无限延伸，`minDate` / `maxDate`
 * 夹取可翻页边界；swipe 只渲染 prev / current / next 三页并回中，
 * 避免小程序长列表开销。
 *
 * `single` 点选即写值；`range` 首点定起点、再点定终点（与 sn-calendar-view
 * 的区间语义一致，越界自动交换）。值是本地零点毫秒时间戳。
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 月份网格 / 弹层 — 用 sn-calendar-view / sn-calendar
 *   - 滚筒选择 — 用 sn-datetime-picker
 */

import { computed, ref } from 'vue';
import type { DateStripDayItem } from './sn-date-strip-types';
import { lunarDayLabel } from '../../utils/sn-lunar';

defineOptions({ name: 'SnDateStrip' });

/** Cell state for styling. */
type DateStripDayType = '' | 'selected' | 'start' | 'end' | 'middle';

const props = withDefaults(
  defineProps<{
    /** 选中值：时间戳；`range` 模式为 `[start, end]`（进行中允许 `[start]`）。 */
    modelValue?: number | number[] | null;
    /** 选择模式。 */
    type?: 'single' | 'range';
    /** 每页天数。 */
    count?: number;
    /** 首页起点（本地零点），默认今天。 */
    startDate?: number | undefined;
    /** 早于该日（时间戳）的格子禁用，并夹住可翻页左边界。 */
    minDate?: number | undefined;
    /** 晚于该日（时间戳）的格子禁用，并夹住可翻页右边界。 */
    maxDate?: number | undefined;
    /** 显示每列顶部的星期字。 */
    showWeek?: boolean;
    /** 格子钩子：改写 text / topInfo / bottomInfo / disabled。 */
    formatter?: ((item: DateStripDayItem) => DateStripDayItem) | undefined;
    /** 农历角标（additive）：日号下方显示农历日名，初一显示月名；`formatter` 可覆盖。 */
    showLunar?: boolean;
    /** 显示两侧翻页按钮（内容可用 `#prev` / `#next` 插槽自定义）。 */
    showNav?: boolean;
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
    showLunar: false,
    showNav: false,
    disabled: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[]): void;
  (e: 'change', payload: { value: number | number[] }): void;
  (e: 'pagechange', payload: { start: number; end: number; index: number }): void;
}>();

const DAY_MS = 86400000;

/** Start of day for a timestamp. */
function startOfDay(timestamp: number): number {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

/** First day of page 0 (local midnight), default today. */
const stripStart = computed(() => startOfDay(props.startDate ?? Date.now()));

const pageMs = computed(() => Math.max(Math.trunc(props.count), 1) * DAY_MS);

/** Start timestamp of page `index`. */
function pageStartOf(index: number): number {
  return stripStart.value + index * pageMs.value;
}

/** Smallest / largest page index that still holds a selectable day. */
const minPageIndex = computed(() =>
  props.minDate === undefined
    ? Number.NEGATIVE_INFINITY
    : Math.ceil((startOfDay(props.minDate) - stripStart.value - pageMs.value + DAY_MS) / pageMs.value),
);
const maxPageIndex = computed(() =>
  props.maxDate === undefined
    ? Number.POSITIVE_INFINITY
    : Math.floor((startOfDay(props.maxDate) - stripStart.value) / pageMs.value),
);

/** Page index anchoring the swiper (initial page follows the bound value). */
function initialPageIndex(): number {
  const value = props.modelValue;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first === 'number') {
    return Math.floor((startOfDay(first) - stripStart.value) / pageMs.value);
  }
  return 0;
}

const pageIndex = ref(initialPageIndex());

/** Build the cells of one page. */
function buildDays(pageStart: number): DateStripDayItem[] {
  const total = Math.max(Math.trunc(props.count), 1);
  const list: DateStripDayItem[] = [];
  for (let index = 0; index < total; index += 1) {
    const date = pageStart + index * DAY_MS;
    const d = new Date(date);
    const min = props.minDate === undefined ? Number.NEGATIVE_INFINITY : startOfDay(props.minDate);
    const max = props.maxDate === undefined ? Number.POSITIVE_INFINITY : startOfDay(props.maxDate);
    const item: DateStripDayItem = {
      date,
      day: d.getDate(),
      week: d.getDay(),
      text: String(d.getDate()),
      topInfo: '',
      bottomInfo: '',
      disabled: props.disabled || date < min || date > max,
    };
    // 农历角标（additive）：先铺农历文案，formatter 仍可覆盖。
    if (props.showLunar) item.bottomInfo = lunarDayLabel(date);
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
}

/* ── Swiper paging (render prev / current / next, recenter after settle) ── */

/** Rendered pages relative to `pageIndex`. */
const pages = computed(() =>
  [-1, 0, 1].map((offset) => {
    const start = pageStartOf(pageIndex.value + offset);
    return { key: start, start, days: buildDays(start) };
  }),
);

/** Swiper position inside the 3-page window; 1 = current page. */
const swiperCurrent = ref(1);

/** True while a programmatic page transition is in flight. */
const animating = ref(false);

function setPageIndex(next: number): void {
  const clamped = Math.min(Math.max(next, minPageIndex.value), maxPageIndex.value);
  if (clamped === pageIndex.value) return;
  pageIndex.value = clamped;
  emit('pagechange', {
    start: pageStartOf(clamped),
    end: pageStartOf(clamped) + pageMs.value - DAY_MS,
    index: clamped,
  });
}

function shiftPage(delta: number): void {
  if (animating.value) return;
  const target = swiperCurrent.value + delta;
  if (target < 0 || target > 2) return;
  animating.value = true;
  swiperCurrent.value = target;
}

/** `prev()` / `next()` expose: animate one page left / right. */
function prev(): void {
  shiftPage(-1);
}
function next(): void {
  shiftPage(1);
}

/** Jump to the page containing `date`. */
function jumpTo(date: number): void {
  setPageIndex(Math.floor((startOfDay(date) - stripStart.value) / pageMs.value));
}

function onSwiperChange(event: { detail: { current: number } }): void {
  swiperCurrent.value = event.detail.current;
}

function onAnimationFinish(): void {
  if (!animating.value && swiperCurrent.value === 1) return;
  const delta = swiperCurrent.value - 1;
  if (delta !== 0) setPageIndex(pageIndex.value + delta);
  // Recenter the 3-page window onto the new current page.
  swiperCurrent.value = 1;
  animating.value = false;
}

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
    'sn-date-strip--nav': props.showNav,
    'sn-date-strip--disabled': props.disabled,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle || undefined);

function dayClass(item: DateStripDayItem): Record<string, boolean> {
  const type = item.disabled ? '' : stateOf(item.date);
  return {
    'sn-date-strip__day--selected': type === 'selected' || type === 'start' || type === 'end',
    'sn-date-strip__day--middle': type === 'middle',
    'sn-date-strip__day--disabled': item.disabled,
  };
}

function weekdayLabel(item: DateStripDayItem): string {
  return WEEK_LABELS[item.week] ?? '';
}

defineExpose({ prev, next, jumpTo });
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'date-strip'"
    role="group"
    :aria-label="'date strip'"
  >
    <view
      v-if="showNav"
      class="sn-date-strip__nav"
      role="button"
      aria-label="previous page"
      @tap="prev()"
    >
      <!-- 翻页按钮内容可整块替换（图标 / 文案 / 自定义组件）。 -->
      <slot name="prev"><text class="sn-date-strip__arrow">‹</text></slot>
    </view>

    <swiper
      class="sn-date-strip__swiper"
      :current="swiperCurrent"
      :duration="200"
      @change="onSwiperChange"
      @animationfinish="onAnimationFinish"
    >
      <swiper-item v-for="page in pages" :key="page.key" class="sn-date-strip__page">
        <view class="sn-date-strip__row">
          <view
            v-for="item in page.days"
            :key="item.date"
            :class="['sn-date-strip__day', dayClass(item)]"
            role="button"
            :aria-label="`${item.text} 日`"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :aria-selected="dayClass(item)['sn-date-strip__day--selected'] ? 'true' : 'false'"
            :tabindex="item.disabled ? -1 : 0"
            @tap="onCellTap(item)"
          >
            <text v-if="showWeek" class="sn-date-strip__week">{{ weekdayLabel(item) }}</text>
            <text v-if="item.topInfo" class="sn-date-strip__info">{{ item.topInfo }}</text>
            <text class="sn-date-strip__text">{{ item.text }}</text>
            <text v-if="item.bottomInfo" class="sn-date-strip__info">{{ item.bottomInfo }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view
      v-if="showNav"
      class="sn-date-strip__nav"
      role="button"
      aria-label="next page"
      @tap="next()"
    >
      <slot name="next"><text class="sn-date-strip__arrow">›</text></slot>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-date-strip {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-family: inherit;
}

.sn-date-strip__swiper {
  flex: 1 1 auto;
  min-width: 0;
  height: 136rpx;
}

.sn-date-strip__page {
  height: 100%;
}

.sn-date-strip__row {
  display: flex;
  align-items: stretch;
  height: 100%;
  box-sizing: border-box;
}

.sn-date-strip__day {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  min-width: 0;
  padding: var(--sn-mp-spacing-1) 0;
  box-sizing: border-box;
  border-radius: var(--sn-mp-radius-md);
}

.sn-date-strip__week {
  font-size: var(--sn-mp-font-size-xs);
  line-height: 1.2;
  color: var(--sn-mp-color-text-tertiary);
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

/* 整列选中：高亮盖住星期 + 日号 + 角标。 */
.sn-date-strip__day--selected {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-date-strip__day--selected .sn-date-strip__week,
.sn-date-strip__day--selected .sn-date-strip__info {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-date-strip__day--middle {
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
}

.sn-date-strip__day--disabled {
  opacity: 0.45;
}

.sn-date-strip--disabled {
  opacity: 0.45;
}

/* 两侧翻页按钮。 */
.sn-date-strip__nav {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 136rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sn-date-strip__arrow {
  font-size: var(--sn-mp-font-size-lg);
  line-height: 1;
}

/* Doodle skin — hand-drawn selection outline. */
.snui-skin-doodle .sn-date-strip__day--selected {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
