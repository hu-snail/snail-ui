<script setup lang="ts">
/**
 * Demo: sn-calendar-view — allowSameDay / defaultTime / immediateChange /
 * customClass / customStyle, plus the declared-only time-column props.
 *
 * - `allow-same-day`: in range mode the start and end may be the same day
 *   (tap one day twice → `[d, d]`)
 * - `default-time`: the timestamp written back by single selection carries this
 *   clock time (default `00:00:00`)
 * - `immediate-change`: change fires as soon as a cell is tapped
 * - `custom-class` / `custom-style`: land on the root node
 * - `time-filter` / `time-item-height` / `time-visible-item-count` /
 *   `hide-second`: this build renders no time roller, so these props exist for
 *   parity only and have no visual effect; they are passed here to show they
 *   are accepted.
 */
import { ref, computed } from 'vue'
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue'
import type { CalendarDayItem } from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view-types'

const min = new Date(2024, 5, 1).getTime()
const max = new Date(2024, 5, 30).getTime()

/** The same day can serve as both range ends. */
const sameDay = ref<number | number[] | null>([new Date(2024, 5, 8).getTime()])

/** Single selection writes back 09:30:00. */
const timed = ref<number | number[] | null>(null)
const timedText = computed(() => {
  const value = timed.value
  if (typeof value !== 'number') return '(not selected)'
  const d = new Date(value)
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n))
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const sameDayText = computed(() => {
  const value = sameDay.value
  if (!Array.isArray(value)) return '(start only)'
  return value.length === 2 && value[0] === value[1] ? 'same day' : 'different days'
})

const changes = ref(0)

/** Time-column filter hook: declared, never invoked by this build. */
function timeFilter(type: 'hour' | 'minute' | 'second', values: number[]): number[] {
  void type
  return values
}

function onChange(): void {
  changes.value += 1
}

/** Keeps the panel title; only restyles the root. */
function markPayday(day: CalendarDayItem): Partial<CalendarDayItem> | undefined {
  return new Date(day.date).getDate() === 15 ? { topInfo: 'PAY' } : undefined
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
    <text class="sn-demo__meta">allowSameDay: both range ends may be the same day — currently {{ sameDayText }}</text>

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
    <text class="sn-demo__meta">defaultTime="09:30:00" + immediateChange: a tap writes the clock time back immediately — {{ timedText }}</text>

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
      timeFilter / timeItemHeight / timeVisibleItemCount / hideSecond exist for parity only (no time roller in this build); customClass / customStyle land on the root
    </text>

    <text class="sn-demo__meta">change fired {{ changes }} times</text>
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
/* custom-class lands on the sn-calendar-view root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__calendar) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
