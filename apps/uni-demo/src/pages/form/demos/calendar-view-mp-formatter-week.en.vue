<script setup lang="ts">
/**
 * Demo: sn-calendar-view — firstDayOfWeek / formatter / showPanelTitle.
 *
 * `first-day-of-week=1` moves Monday to the first column; `formatter` receives
 * each cell and may rewrite text / topInfo / bottomInfo / disabled;
 * `show-panel-title=false` drops the month caption so only the grid remains.
 */
import { ref } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';
import type { CalendarDayItem } from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view-types';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 5, 30).getTime();

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 12).getTime());
const bare = ref<number | number[] | null>(null);

/** Tag weekends with a caption under the day number — formatter returns only the changed fields. */
function markWeekend(day: CalendarDayItem): Partial<CalendarDayItem> | undefined {
  const weekday = new Date(day.date).getDay();
  return weekday === 0 || weekday === 6 ? { bottomInfo: 'OFF' } : undefined;
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
    <text class="sn-demo__meta"
      >firstDayOfWeek=1 starts the week on Monday; formatter captions weekends with "OFF"</text
    >

    <SnCalendarView
      v-model="bare"
      :min-date="min"
      :max-date="max"
      :show-panel-title="false"
      :panel-height="240"
    />
    <text class="sn-demo__meta">showPanelTitle=false: grid only, no "2024 / 6" caption</text>
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
