<script setup lang="ts">
/** Demo: sn-calendar — `shortcuts` renders preset chips (`days` is relative to today); `type="daterange"` selects a span; `beforeConfirm` can veto. */
import { ref, computed } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();
const range = ref<number | number[] | null>(null);
const open = ref(false);
const shortcuts = [
  { text: 'Today', days: 0 },
  { text: 'Last 7 days', days: -7 },
  { text: 'Last 30 days', days: -30 },
];
const rangeText = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length < 2) return '(not selected)';
  return value
    .map((v) => {
      const d = new Date(v);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    })
    .join(' - ');
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Range + shortcuts</view>
    <text class="sn-demo__meta">Range: {{ rangeText }}</text>
    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      title="Pick a range"
      confirm-text="Use it"
    />
  </view>
</template>

<style scoped>
.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
