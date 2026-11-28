<script setup lang="ts">
/** Demo: sn-keyboard — 随机键序（randomKeyOrder）：数字键随机排列。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const shuffled = ref('');
const openShuffled = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">randomKeyOrder（数字键随机排列）</text>
    <view class="sn-demo__button" @tap="openShuffled = true">随机键序</view>
    <SnKeyboard
      v-model="shuffled"
      v-model:visible="openShuffled"
      :maxlength="6"
      title="随机键序"
      random-key-order
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

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
</style>
