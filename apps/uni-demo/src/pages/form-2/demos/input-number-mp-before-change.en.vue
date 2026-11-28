<script setup lang="ts">
/** Demo: sn-input-number — commit veto (beforeChange): even numbers only. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const guarded = ref(5);
const lastGuard = ref('—');

/** Even numbers only — demonstrates the beforeChange veto. */
const evenOnly = (value: number | string) => {
  const numeric = Number(value);
  const allowed = Number.isFinite(numeric) && numeric % 2 === 0;
  lastGuard.value = allowed ? 'Allowed' : 'Even numbers only';
  return allowed;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">beforeChange (even numbers only)</text>
    <SnInputNumber v-model="guarded" :min="0" :max="20" :before-change="evenOnly" />
    <text class="sn-demo__meta">Guard: {{ lastGuard }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
