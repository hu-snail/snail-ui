<script setup lang="ts">
/** Demo: sn-input-number — 步进吸附（stepStrictly）：step=3 时值吸附到 0/3/6/9…；带边界时修正到区间内最近的步进倍数。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const snapped = ref(0);
const bounded = ref(1);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">stepStrictly + step=3（值吸附到 0/3/6/9…）</text>
    <SnInputNumber v-model="snapped" :min="0" :max="20" :step="3" step-strictly />

    <text class="sn-demo__title">stepStrictly + step=2 + min=3 + max=15（1 → 4，17 → 14）</text>
    <SnInputNumber v-model="bounded" :min="3" :max="15" :step="2" step-strictly />
    <text class="sn-demo__meta">修正后：{{ bounded }}</text>
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
