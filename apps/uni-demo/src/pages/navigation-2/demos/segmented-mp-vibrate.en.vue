<script setup lang="ts">
/**
 * Demo: sn-segmented — English shadow of segmented-mp-vibrate.
 */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const size = ref('md');
const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSegmented v-model="size" :options="sizeOptions" vibrate-short />
    <text class="sn-demo__meta">
      vibrate-short fires a short haptic on switch; hosts without a vibration motor skip it
      silently.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
