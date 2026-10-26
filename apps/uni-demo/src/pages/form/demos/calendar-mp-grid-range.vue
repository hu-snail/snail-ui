<script setup lang="ts">
/** Demo: sn-calendar — 网格与区间约束：firstDayOfWeek / formatter / maxRange + rangePrompt / allowSameDay / defaultTime。 */
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

/** formatter：把每月的 1 号标成「月首」，周末置灰。 */
const cellFormatter = (day: { date: number; text: string }) => {
  const d = new Date(day.date);
  if (d.getDate() === 1) return { topInfo: '月首' };
  if (d.getDay() === 0 || d.getDay() === 6) return { disabled: true, bottomInfo: '休息' };
  return undefined;
};

const rangeText = computed(() => {
  const value = limitedRange.value;
  if (!Array.isArray(value) || value.length < 2) return '（未选择）';
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
    <text class="sn-demo__title">firstDayOfWeek（周一作为一周起点）</text>
    <view class="sn-demo__button" @tap="openMonday = true">周一起始</view>
    <SnCalendar
      v-model="mondayFirst"
      v-model:visible="openMonday"
      type="date"
      title="周一起始"
      :first-day-of-week="1"
      :min-date="min"
      :max-date="max"
    />

    <text class="sn-demo__title">formatter（自定义 topInfo / bottomInfo / disabled）</text>
    <view class="sn-demo__button" @tap="openFormatted = true">格式化单元格</view>
    <SnCalendar
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="格式化单元格"
      :min-date="min"
      :max-date="max"
      :formatter="cellFormatter"
    />

    <text class="sn-demo__title">maxRange + rangePrompt + allowSameDay + defaultTime</text>
    <view class="sn-demo__button" @tap="openRange = true">最多 7 天</view>
    <text class="sn-demo__meta">区间：{{ rangeText }}</text>
    <SnCalendar
      v-model="limitedRange"
      v-model:visible="openRange"
      type="daterange"
      title="最多 7 天"
      :min-date="min"
      :max-date="max"
      :max-range="7"
      range-prompt="最多只能选 7 天"
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
