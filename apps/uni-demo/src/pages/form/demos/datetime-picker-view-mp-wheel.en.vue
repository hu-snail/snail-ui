<script setup lang="ts">
/** Demo: sn-datetime-picker-view — inline wheel style time roller with the pill band and slide haptic. */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const value = ref<string | number>(new Date(2026, 5, 15, 9, 30, 0).getTime());

const pad = (n: number) => String(n).padStart(2, '0');
const timeText = () => {
  const d = new Date(Number(value.value));
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDatetimePickerView v-model="value" type="time" wheel vibrate-short :visible-item-count="5" />
    <text class="sn-demo__meta">Selected: {{ timeText() }} (each detent ticks on App / MP)</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
