<script setup lang="ts">
/** Demo: sn-picker — Sheet picker: `v-model:visible` drives the sheet; rolling only updates the draft and `v-model` is written on confirm. */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const fruits = ['Apple', 'Banana', 'Cherry'];
const picked = ref<Array<string | number>>(['Apple']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick a fruit</view>
    <text class="sn-demo__meta">Selected: {{ picked.join(' / ') || '(none)' }}</text>
    <SnPicker v-model="picked" v-model:visible="open" :columns="[fruits]" title="Pick a fruit" />
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
