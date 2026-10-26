<script setup lang="ts">
/** Demo: sn-keyboard — sn-keyboard 数字键盘：maxlength 限长，delete 退格，close 收起；搭配只读输入框使用。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const amount = ref('');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">打开键盘</view>
    <text class="sn-demo__meta">当前值：{{ amount || '（空）' }}</text>
    <SnKeyboard v-model="amount" v-model:visible="open" :maxlength="6" title="金额" />
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
