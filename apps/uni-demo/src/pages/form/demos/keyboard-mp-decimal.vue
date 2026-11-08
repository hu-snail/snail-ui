<script setup lang="ts">
/** Demo: sn-keyboard — 小数点键盘：extra-key="." 落在底行左槽，用于金额输入。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const amount = ref('');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">打开键盘</view>
    <text class="sn-demo__meta">金额：{{ amount || '（空）' }}</text>
    <SnKeyboard
      v-model="amount"
      v-model:visible="open"
      :maxlength="8"
      title="金额"
      extra-key="."
      close-text="完成"
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
