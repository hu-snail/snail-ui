<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — canvas id (`canvasId`) + root styling (`customClass` / `customStyle`).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnQrCode
      canvas-id="sn-demo-qr-canvas"
      text="https://snui.dev/canvas-id"
      :size="160"
      :margin="8"
      custom-class="sn-qr-demo__root"
      custom-style="padding: 12rpx"
    />
    <text class="sn-demo__meta">
      canvasId pins the canvas id (by default one is derived from the instance uid so several codes
      on a page never clash); customClass / customStyle apply to the root node.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-qr-demo__root) {
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
