<script setup lang="ts">
/** Demo: sn-input-number — Basic sn-input-number: min / max bounds, step and precision. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const qty = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="qty" :min="1" :max="10" />
    <text class="sn-demo__meta">Quantity: {{ qty }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
