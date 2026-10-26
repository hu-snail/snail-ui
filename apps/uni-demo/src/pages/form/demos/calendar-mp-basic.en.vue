<script setup lang="ts">
/** Demo: sn-calendar — Sheet calendar: rolling only updates the draft and `v-model` is written on confirm; cancel discards the draft. */
import { ref, computed } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 7, 31).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);
const formatted = computed(() => {
  const value = date.value;
  if (typeof value !== 'number') return '(not selected)';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick a date</view>
    <text class="sn-demo__meta">Selected: {{ formatted }}</text>
    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="Pick a date"
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
