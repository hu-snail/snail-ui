<script setup lang="ts">
/**
 * Demo: sn-calendar-view — same start and end day (allowSameDay).
 *
 * `allow-same-day`: in range mode the start and end may be the same day
 * (tap one day twice → `[d, d]`).
 */
import { ref, computed } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 5, 30).getTime();

/** The same day can serve as both range ends. */
const sameDay = ref<number | number[] | null>([new Date(2024, 5, 8).getTime()]);

const sameDayText = computed(() => {
  const value = sameDay.value;
  if (!Array.isArray(value)) return '(start only)';
  return value.length === 2 && value[0] === value[1] ? 'same day' : 'different days';
});
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
    />
    <text class="sn-demo__meta"
      >allowSameDay: both range ends may be the same day — currently {{ sameDayText }}</text
    >
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
