<script setup lang="ts">
/**
 * Demo: sn-watermark (uni-end) — text watermark grid.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-watermark from its SFC source.
 */
import SnWatermark from '@snui/uni-src/components/sn-watermark/sn-watermark.vue';
</script>

<template>
  <view class="sn-demo sn-watermark-demo__stage">
    <SnWatermark content="仅供内部使用" :full-screen="false" :opacity="0.35" />
    <view class="sn-watermark-demo__card">
      <text class="sn-watermark-demo__title">合同预览</text>
      <text class="sn-watermark-demo__body">
        水印覆盖在本区域之上，pointer-events: none，不会拦截点击。
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
