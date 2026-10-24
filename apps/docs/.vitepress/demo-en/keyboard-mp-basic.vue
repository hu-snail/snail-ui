<script setup lang="ts">
/** Demo: sn-keyboard — Numeric keypad: `maxlength` caps the value, delete removes one character, close hides it; pair it with a read-only field. */
import { ref } from 'vue'
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue'

const amount = ref('')
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Open keypad</view>
    <text class="sn-demo__meta">Value: {{ amount || '(empty)' }}</text>
    <SnKeyboard v-model="amount" v-model:visible="open" :maxlength="6" title="Amount" />
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
