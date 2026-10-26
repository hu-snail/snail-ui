<script setup lang="ts">
/** Demo: sn-calendar-view — Flat month grid: minDate / maxDate bound the month range; tapping a day writes its timestamp back. */
import { ref, computed } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 7, 31).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const formatted = computed(() => {
  const value = date.value;
  if (typeof value !== 'number') return '(not selected)';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCalendarView v-model="date" :min-date="min" :max-date="max" />
    <text class="sn-demo__meta">Selected: {{ formatted }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
