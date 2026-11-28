<script setup lang="ts">
/** Demo: sn-datetime-picker — wheel 风格：日期时间弹层滚轮换装胶囊高亮带 + 滑动震动。 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';

const value = ref<string | number>(new Date(2026, 5, 15, 9, 0, 0).getTime());
const open = ref(false);

const pad = (n: number) => String(n).padStart(2, '0');
const valueText = computed(() => {
  const d = new Date(Number(value.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true"><text>选择日期时间</text></view>
    <text class="sn-demo__meta">已选：{{ valueText }}（wheel 胶囊带 + 滑动震动）</text>
    <SnDatetimePicker
      v-model="value"
      v-model:visible="open"
      type="datetime"
      title="选择时间"
      wheel
      vibrate-short
      :visible-item-count="5"
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
  flex-direction: row;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
