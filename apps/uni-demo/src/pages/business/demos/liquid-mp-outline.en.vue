<script setup lang="ts">
/**
 * Demo: sn-liquid (uni-end) — Outline ring on/off.
 */
import SnLiquid from '@snui/uni-src/components/sn-liquid/sn-liquid.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="liquid-row">
      <SnLiquid :percent="55" outline size="160rpx" />
      <SnLiquid :percent="55" size="160rpx" />
    </view>
    <text class="sn-demo__meta">Left ball has the outline ring; right ball is the default</text>
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
