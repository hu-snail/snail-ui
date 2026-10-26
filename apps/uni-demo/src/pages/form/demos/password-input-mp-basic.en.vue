<script setup lang="ts">
/** Demo: sn-password-input — Boxed PIN field: `length` sets the box count, `mask` toggles the dots and `focused` drives the caret (pair it with the keyboard visibility). */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const pin = ref('123');
const focused = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="pin" :length="6" :focused="focused" info="Enter the 6-digit PIN" />
    <view class="sn-demo__button" @tap="focused = !focused">Toggle focus</view>
    <text class="sn-demo__meta">Value: {{ pin || '(empty)' }}</text>
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
