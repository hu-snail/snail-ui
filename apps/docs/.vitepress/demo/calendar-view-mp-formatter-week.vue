<script setup lang="ts">
/**
 * Demo: sn-calendar-view — firstDayOfWeek / formatter / showPanelTitle。
 *
 * `first-day-of-week=1` 把周一挪到第一列；`formatter` 拿到单元格数据后可以
 * 改写 text / topInfo / bottomInfo / disabled；`show-panel-title=false` 收起
 * 月份标题，面板只剩网格。
 */
import { ref } from 'vue'
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue'
import type { CalendarDayItem } from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view-types'

const min = new Date(2024, 5, 1).getTime()
const max = new Date(2024, 5, 30).getTime()

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 12).getTime())
const bare = ref<number | number[] | null>(null)

/** 周末在单元格底部标「休」：formatter 只返回需要改写的字段。 */
function markWeekend(day: CalendarDayItem): Partial<CalendarDayItem> | undefined {
  const weekday = new Date(day.date).getDay()
  return weekday === 0 || weekday === 6 ? { bottomInfo: '休' } : undefined
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCalendarView
      v-model="mondayFirst"
      :min-date="min"
      :max-date="max"
      :first-day-of-week="1"
      :formatter="markWeekend"
      :panel-height="240"
    />
    <text class="sn-demo__meta">firstDayOfWeek=1 周一起始 + formatter 在周末格底部加「休」</text>

    <SnCalendarView
      v-model="bare"
      :min-date="min"
      :max-date="max"
      :show-panel-title="false"
      :panel-height="240"
    />
    <text class="sn-demo__meta">showPanelTitle=false：只留网格，不渲染「2024 年 6 月」标题</text>
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
</style>
