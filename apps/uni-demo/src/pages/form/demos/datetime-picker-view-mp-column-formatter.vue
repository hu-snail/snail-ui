<script setup lang="ts">
/** Demo: sn-datetime-picker-view — 列改写（columnFormatter）：把年份列倒序（最新年份在最上）。 */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const reversed = ref<string | number>(new Date(2024, 5, 15).getTime());

/** columnFormatter：把年份列倒序（最新年份在最上）。 */
const reverseYears = (type: string, values: number[]) =>
  type === 'year' ? [...values].reverse() : values;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDatetimePickerView
      v-model="reversed"
      type="date"
      :min-date="min"
      :max-date="max"
      :column-formatter="reverseYears"
    />
    <text class="sn-demo__meta">columnFormatter（年份列倒序）</text>
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
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
