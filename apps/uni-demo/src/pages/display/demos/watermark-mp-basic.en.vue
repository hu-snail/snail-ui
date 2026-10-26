<script setup lang="ts">
/**
 * Demo: sn-watermark (uni-end) — text watermark grid.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-watermark from its SFC source.
 */
import SnWatermark from '@snui/uni-src/components/sn-watermark/sn-watermark.vue';
</script>

<template>
  <view class="sn-demo sn-watermark-demo__stage">
    <SnWatermark content="Internal use only" :full-screen="false" :opacity="0.35" />
    <view class="sn-watermark-demo__card">
      <text class="sn-watermark-demo__title">Contract preview</text>
      <text class="sn-watermark-demo__body">
        The watermark covers this area with pointer-events: none, so taps pass through.
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-watermark-demo__stage {
  position: relative;
  width: 100%;
  height: 420rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-surface);
}
.sn-watermark-demo__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 32rpx;
}
.sn-watermark-demo__title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.sn-watermark-demo__body {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
