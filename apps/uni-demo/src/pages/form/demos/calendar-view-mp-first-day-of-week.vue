<script setup lang="ts">
/**
 * Demo: sn-calendar-view — 周起始日（firstDayOfWeek）。
 *
 * `first-day-of-week=1` 把周一挪到第一列。
 */
import { ref } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 5, 30).getTime();

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 12).getTime());
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCalendarView
      v-model="mondayFirst"
      :min-date="min"
      :max-date="max"
      :first-day-of-week="1"
      :panel-height="240"
    />
    <text class="sn-demo__meta">firstDayOfWeek=1 周一起始</text>
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
