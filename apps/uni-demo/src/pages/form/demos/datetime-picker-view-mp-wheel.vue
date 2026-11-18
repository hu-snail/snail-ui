<script setup lang="ts">
/** Demo: sn-datetime-picker-view — wheel 风格内嵌滚轮：时间列换装胶囊高亮带，滑动有轻震。 */
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
    <text class="sn-demo__meta">已选：{{ timeText() }}（滑动经过每一行有轻震，App / 小程序生效）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
