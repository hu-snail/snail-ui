<script setup lang="ts">
/**
 * Demo: sn-watermark (uni-end) — 图片水印（image / imageWidth / imageHeight）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-watermark from its SFC source.
 */
import SnWatermark from '@snui/uni-src/components/sn-watermark/sn-watermark.vue';

const logo = 'https://picsum.photos/seed/snui-wm-logo/200/200';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-watermark-demo__stage">
      <SnWatermark
        :image="logo"
        :image-width="90"
        :image-height="90"
        :full-screen="false"
        :opacity="0.25"
      />
      <view class="sn-watermark-demo__card">
        <text class="sn-watermark-demo__title">图片水印瓦片</text>
        <text class="sn-watermark-demo__body"
          >image 优先于 content，瓦片尺寸由 imageWidth / imageHeight 决定。</text
        >
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-watermark-demo__stage {
  position: relative;
  width: 100%;
  height: 280rpx;
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
