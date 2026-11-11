<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — 尺寸：size 各档。
 */
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="liquid-row">
      <SnLiquid :percent="40" size="120rpx" />
      <SnLiquid :percent="60" size="160rpx" />
      <SnLiquid :percent="80" size="200rpx" />
    </view>
    <text class="sn-demo__meta">size 120 / 160 / 200rpx</text>
  </view>
</template>

<style scoped>
.liquid-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sn-mp-spacing-4);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
