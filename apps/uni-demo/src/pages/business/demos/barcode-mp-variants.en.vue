<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — Variant matrix: text position / module width /
 * height / font size / hidden text / line color.
 */
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">text-position="top"</text>
    <view class="barcode-card">
      <SnBarcode text="690123456789" text-position="top" :module-width="2" />
    </view>

    <text class="sn-demo__title">show-text=false</text>
    <view class="barcode-card">
      <SnBarcode text="690123456789" :show-text="false" :module-width="2" />
    </view>

    <text class="sn-demo__title">module-width=4 + height / fontSize</text>
    <view class="barcode-card">
      <SnBarcode text="690123456789" :module-width="4" height="160rpx" font-size="28rpx" />
    </view>

    <text class="sn-demo__title">Custom line-color</text>
    <view class="barcode-card">
      <SnBarcode
        text="690123456789"
        :module-width="2"
        line-color="var(--sn-mp-color-feedback-success)"
      />
    </view>
    <text class="sn-demo__meta">line-color drives both bar and text color</text>
  </view>
</template>

<style scoped>
.barcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-demo__title {
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
