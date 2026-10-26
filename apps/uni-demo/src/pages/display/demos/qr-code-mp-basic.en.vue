<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — basic QR code: text, size, EC level.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__row">
      <SnQrCode text="https://snui.dev" :size="160" />
      <SnQrCode text="AUI-20240001" :size="160" correct-level="M" />
    </view>
    <text class="sn-demo__meta"
      >Left: default EC level H; right: level M — a shorter payload means bigger modules.</text
    >
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
