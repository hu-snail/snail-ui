<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — 渐变码（enableGradient / gradientColors / gradientDirection）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue';
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
      gradientColors 传 2 个以上颜色时覆盖 gradientColor；gradientDirection 取 diagonal / horizontal
      / vertical， 也可以直接给角度数值（第三张为 45°）。
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
</style>
