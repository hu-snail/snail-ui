<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — 基础二维码：文本、尺寸、纠错级别。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__row">
      <SnQrCode text="https://snui.dev" :size="160" />
      <SnQrCode text="AUI-20240001" :size="160" correct-level="M" />
    </view>
    <text class="sn-demo__meta">左：默认纠错 H；右：纠错 M，内容更短，模块更大。</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
</style>
