<script setup lang="ts">
/** Demo: sn-calendar — shortcuts 渲染预设 chip（days 相对今天）；type="daterange" 选区间；beforeConfirm 可拦确认。 */
import { ref, computed } from 'vue';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();
const range = ref<number | number[] | null>(null);
const open = ref(false);
const shortcuts = [
  { text: '今天', days: 0 },
  { text: '近一周', days: -7 },
  { text: '近一月', days: -30 },
];
const rangeText = computed(() => {
  const value = range.value;
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
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">区间 + 快捷选项</view>
    <text class="sn-demo__meta">区间：{{ rangeText }}</text>
    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      :min-date="min"
      :max-date="max"
      :shortcuts="shortcuts"
      title="选择区间"
      confirm-text="就用它"
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
