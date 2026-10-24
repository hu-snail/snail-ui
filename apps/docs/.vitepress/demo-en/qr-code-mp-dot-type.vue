<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — module shapes and colors.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__row">
      <SnQrCode text="https://snui.dev" :size="130" dot-type="square" />
      <SnQrCode text="https://snui.dev" :size="130" dot-type="dots" :dot-scale="0.9" />
      <SnQrCode text="https://snui.dev" :size="130" dot-type="rounded" />
      <SnQrCode text="https://snui.dev" :size="130" dot-type="liquid" />
    </view>
    <view class="sn-demo__row">
      <SnQrCode
        text="https://snui.dev"
        :size="150"
        color-dark="midnightblue"
        color-light="azure"
        :margin="10"
      />
      <SnQrCode
        text="https://snui.dev"
        :size="150"
        :margin="10"
        enable-gradient
        gradient-color="teal"
        gradient-direction="vertical"
      />
    </view>
    <text class="sn-demo__meta">Top row: square / dots / rounded / liquid. Bottom row: custom dark & light colors, vertical gradient.</text>
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
  gap: 16rpx;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
</style>
