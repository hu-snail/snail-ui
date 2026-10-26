<script setup lang="ts">
/** Demo: sn-datetime-picker — sn-datetime-picker 弹层选择器：滚动只改草稿，确认才写 v-model。 */
import { ref, computed } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';

const stamp = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const open = ref(false);
const formatted = computed(() => {
  if (stamp.value === undefined) return '（未选择）';
  const d = new Date(Number(stamp.value));
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择日期</view>
    <text class="sn-demo__meta">已选：{{ formatted }}</text>
    <SnDatetimePicker v-model="stamp" v-model:visible="open" type="date" title="选择日期" />
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
