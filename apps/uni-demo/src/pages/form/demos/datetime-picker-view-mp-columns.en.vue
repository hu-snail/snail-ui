<script setup lang="ts">
/** Demo: sn-datetime-picker-view — roller geometry and column rewriting: itemHeight / visibleItemCount / valueKey / labelKey / columnFormatter. */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const tall = ref<string | number>(new Date(2024, 5, 15).getTime());
const reversed = ref<string | number>(new Date(2024, 5, 15).getTime());

/** columnFormatter: reverse the year column (newest year first). */
const reverseYears = (type: string, values: number[]) =>
  type === 'year' ? [...values].reverse() : values;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">itemHeight + visibleItemCount (52px rows, 5 visible)</text>
    <SnDatetimePickerView
      v-model="tall"
      type="date"
      :min-date="min"
      :max-date="max"
      :item-height="52"
      :visible-item-count="5"
      value-key="value"
      label-key="label"
    />

    <text class="sn-demo__title">columnFormatter (reverse the year column)</text>
    <SnDatetimePickerView
      v-model="reversed"
      type="date"
      :min-date="min"
      :max-date="max"
      :column-formatter="reverseYears"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
