<script setup lang="ts">
/**
 * Demo: sn-calendar-view — allowSameDay / defaultTime / immediateChange /
 * customClass / customStyle，以及只做对齐声明的时间列 props。
 *
 * - `allow-same-day`：区间模式下允许起止同为一天（点同一天两次 → `[d, d]`）
 * - `default-time`：单选写回的时间戳会带上这里的时分秒（默认 `00:00:00`）
 * - `immediate-change`：点中即触发 change（不等二次确认）
 * - `custom-class` / `custom-style`：落在根节点上
 * - `time-filter` / `time-item-height` / `time-visible-item-count` / `hide-second`：
 *   本构建面板内没有时间滚筒，这些 prop 只按参考实现声明，不会产生渲染效果，
 *   这里一并传入以证明它们不会报错。
 */
import { ref, computed } from 'vue'
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue'
import type { CalendarDayItem } from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view-types'

const min = new Date(2024, 5, 1).getTime()
const max = new Date(2024, 5, 30).getTime()

/** 同一天可作区间起止。 */
const sameDay = ref<number | number[] | null>([new Date(2024, 5, 8).getTime()])

/** 单选写回 09:30:00。 */
const timed = ref<number | number[] | null>(null)
const timedText = computed(() => {
  const value = timed.value
  if (typeof value !== 'number') return '（未选择）'
  const d = new Date(value)
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n))
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const sameDayText = computed(() => {
  const value = sameDay.value
  if (!Array.isArray(value)) return '（只选了起点）'
  return value.length === 2 && value[0] === value[1] ? '起止同一天' : '起止不同天'
})

const changes = ref(0)

/** 时间列过滤钩子：声明在案，本构建不会调用。 */
function timeFilter(type: 'hour' | 'minute' | 'second', values: number[]): number[] {
  void type
  return values
}

function onChange(): void {
  changes.value += 1
}

/** 面板标题保留，仅改根节点外框。 */
function markPayday(day: CalendarDayItem): Partial<CalendarDayItem> | undefined {
  return new Date(day.date).getDate() === 15 ? { topInfo: '薪' } : undefined
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCalendarView
      v-model="sameDay"
      type="daterange"
      :min-date="min"
      :max-date="max"
      allow-same-day
      :panel-height="220"
      @change="onChange"
    />
    <text class="sn-demo__meta">allowSameDay：区间起止可同一天 —— 当前 {{ sameDayText }}</text>

    <SnCalendarView
      v-model="timed"
      :min-date="min"
      :max-date="max"
      default-time="09:30:00"
      immediate-change
      :panel-height="220"
      :formatter="markPayday"
      @change="onChange"
    />
    <text class="sn-demo__meta">defaultTime="09:30:00" + immediateChange：点中即写回带时分秒的时间戳 —— {{ timedText }}</text>

    <SnCalendarView
      v-model="timed"
      :min-date="min"
      :max-date="max"
      :time-filter="timeFilter"
      :time-item-height="40"
      :time-visible-item-count="5"
      hide-second
      :panel-height="200"
      custom-class="sn-demo__calendar"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">
      timeFilter / timeItemHeight / timeVisibleItemCount / hideSecond 只做声明对齐（面板内无时间滚筒）；customClass / customStyle 落在根节点
    </text>

    <text class="sn-demo__meta">change 已触发 {{ changes }} 次</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-calendar-view 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__calendar) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
