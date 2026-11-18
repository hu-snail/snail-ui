<script setup lang="ts">
/** Demo: sn-datetime-picker-view — wheel 风格内嵌滚轮：时间列换装胶囊高亮带，滑动有轻震。 */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

// type="time" 初始可传 timestamp,组件写回 'HH:mm' 字符串——两种形态都要能显示。
const value = ref<string | number>(new Date(2026, 5, 15, 9, 30, 0).getTime());

const pad = (n: number) => String(n).padStart(2, '0');
const timeText = (): string => {
  const raw = value.value;
  if (typeof raw === 'string') return raw.slice(0, 5);
  const d = new Date(raw);
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
