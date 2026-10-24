<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — 多色渐变 / 角度渐变 / canvasId / custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnQrCode
        text="https://snui.dev/gradient"
        :size="150"
        :margin="10"
        enable-gradient
        :gradient-colors="['midnightblue', 'teal', 'mediumseagreen']"
        gradient-direction="diagonal"
      />
      <SnQrCode
        text="https://snui.dev/angle"
        :size="150"
        :margin="10"
        enable-gradient
        gradient-color="purple"
        :gradient-direction="45"
      />
      <SnQrCode
        text="https://snui.dev/horizontal"
        :size="150"
        :margin="10"
        enable-gradient
        gradient-color="crimson"
        gradient-direction="horizontal"
      />
    </view>
    <text class="sn-demo__meta">
      gradientColors 传 2 个以上颜色时覆盖 gradientColor；gradientDirection 取 diagonal / horizontal / vertical，
      也可以直接给角度数值（第三张为 45°）。
    </text>

    <SnQrCode
      canvas-id="sn-demo-qr-canvas"
      text="https://snui.dev/canvas-id"
      :size="160"
      :margin="8"
      custom-class="sn-qr-demo__root"
      custom-style="padding: 12rpx"
    />
    <text class="sn-demo__meta">
      canvasId 指定画布 id（默认按实例 uid 生成，保证同页多个二维码不冲突）；customClass / customStyle 作用在根节点。
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: flex-start;
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
