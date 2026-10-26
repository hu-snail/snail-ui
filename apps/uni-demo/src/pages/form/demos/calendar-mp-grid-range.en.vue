<script setup lang="ts">
/** Demo: sn-calendar — grid and range constraints: firstDayOfWeek / formatter / maxRange + rangePrompt / allowSameDay / defaultTime. */
import { computed, ref } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openMonday = ref(false);

const formatted = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openFormatted = ref(false);

const limitedRange = ref<number | number[] | null>(null);
const openRange = ref(false);

/** formatter: tag the 1st of every month and grey out weekends. */
const cellFormatter = (day: { date: number; text: string }) => {
  const d = new Date(day.date);
  if (d.getDate() === 1) return { topInfo: '1st' };
  if (d.getDay() === 0 || d.getDay() === 6) return { disabled: true, bottomInfo: 'Off' };
  return undefined;
};

const rangeText = computed(() => {
  const value = limitedRange.value;
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
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">firstDayOfWeek (Monday starts the week)</text>
    <view class="sn-demo__button" @tap="openMonday = true">Monday first</view>
    <SnCalendar
      v-model="mondayFirst"
      v-model:visible="openMonday"
      type="date"
      title="Monday first"
      :first-day-of-week="1"
      :min-date="min"
      :max-date="max"
    />

    <text class="sn-demo__title">formatter (custom topInfo / bottomInfo / disabled)</text>
    <view class="sn-demo__button" @tap="openFormatted = true">Formatted cells</view>
    <SnCalendar
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="Formatted cells"
      :min-date="min"
      :max-date="max"
      :formatter="cellFormatter"
    />

    <text class="sn-demo__title">maxRange + rangePrompt + allowSameDay + defaultTime</text>
    <view class="sn-demo__button" @tap="openRange = true">At most 7 days</view>
    <text class="sn-demo__meta">Range: {{ rangeText }}</text>
    <SnCalendar
      v-model="limitedRange"
      v-model:visible="openRange"
      type="daterange"
      title="At most 7 days"
      :min-date="min"
      :max-date="max"
      :max-range="7"
      range-prompt="You can only pick 7 days"
      allow-same-day
      default-time="08:00:00"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

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
