<script setup lang="ts">
/**
 * Demo: sn-watermark (uni-end) — tile size, gutters, rotation and layout.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-watermark from its SFC source.
 */
import SnWatermark from '@snui/uni-src/components/sn-watermark/sn-watermark.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-watermark-demo__stage">
      <SnWatermark
        content="default -25°"
        :full-screen="false"
        :width="120"
        :height="120"
        :gutter-x="20"
        :gutter-y="20"
      />
    </view>

    <view class="sn-watermark-demo__stage">
      <SnWatermark
        content="rotate 0 · staggered"
        :full-screen="false"
        :rotate="0"
        layout="staggered"
        :width="140"
        :height="80"
        :size="12"
        color="var(--sn-mp-color-text-tertiary)"
      />
    </view>

    <view class="sn-watermark-demo__stage">
      <SnWatermark
        content="rotate 30 · large"
        :full-screen="false"
        :rotate="30"
        :width="160"
        :height="160"
        :size="20"
        font-weight="700"
        :opacity="0.5"
      />
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
</style>
