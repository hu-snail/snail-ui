<script setup lang="ts">
/** Demo: sn-datetime-picker — type="time" 写回 "HH:mm" 字符串；beforeConfirm 返回 false 时弹层不关闭。 */
import { ref } from 'vue'
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'

const time = ref<string | number | undefined>('10:30')
const open = ref(false)
// 只允许确认 09:00 之后的时间 —— 用来演示 beforeConfirm 拦截。
const guard = (value: string | number) => String(value) >= '09:00'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择时间</view>
    <text class="sn-demo__meta">已选：{{ time || '（未选择）' }}</text>
    <SnDatetimePicker
      v-model="time"
      v-model:visible="open"
      type="time"
      title="选择时间"
      confirm-button-text="就它"
      :before-confirm="guard"
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
