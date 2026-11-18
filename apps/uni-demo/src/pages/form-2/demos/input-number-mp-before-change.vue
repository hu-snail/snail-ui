<script setup lang="ts">
/** Demo: sn-input-number — 提交拦截（beforeChange）：只接受偶数。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const guarded = ref(5);
const lastGuard = ref('—');

/** 偶数才允许提交 —— 演示 beforeChange 拦截。 */
const evenOnly = (value: number | string) => {
  const numeric = Number(value);
  const allowed = Number.isFinite(numeric) && numeric % 2 === 0;
  lastGuard.value = allowed ? '已允许' : '只接受偶数';
  return allowed;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">beforeChange（只接受偶数）</text>
    <SnInputNumber v-model="guarded" :min="0" :max="20" :before-change="evenOnly" />
    <text class="sn-demo__meta">守卫：{{ lastGuard }}</text>
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
