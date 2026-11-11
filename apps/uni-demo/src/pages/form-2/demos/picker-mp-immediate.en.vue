<script setup lang="ts">
/** Demo: sn-picker — commit while scrolling: immediateChange writes v-model continuously during the roll instead of on confirm. */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const fruits = ['Apple', 'Banana', 'Cherry', 'Watermelon', 'Grape'];

const instant = ref<Array<string | number>>(['Banana']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">immediateChange</text>
    <view class="sn-demo__button" @tap="open = true">Write on every roll</view>
    <text class="sn-demo__meta">Selected: {{ instant.join(' / ') }}</text>
    <SnPicker
      v-model="instant"
      v-model:visible="open"
      :columns="[fruits]"
      title="Write on every roll"
      immediate-change
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

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
