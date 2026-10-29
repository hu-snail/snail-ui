<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — 变体矩阵：多格式 / 布局方向 / 样式属性。
 */
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">不同格式 format</text>
    <view class="barcode-card">
      <SnBarcode text="HELLO123$%+" format="CODE128" :module-width="2" />
      <SnBarcode text="HELLO123-" format="CODE39" :module-width="2" />
      <SnBarcode text="690123456789" format="EAN13" :module-width="2" />
      <SnBarcode text="A123456789B" format="CODEBAR" :module-width="2" />
      <SnBarcode text="12345678" format="ITF" :module-width="2" />
      <SnBarcode text="69012345" format="EAN8" :module-width="2" />
      <SnBarcode text="012345678905" format="UPC" :module-width="2" />
    </view>
    <text class="sn-demo__meta">EAN 系列自动补算 / 校验校验位，非法输入走 error 事件</text>

    <text class="sn-demo__title">布局方向 layout</text>
    <view class="barcode-row">
      <view class="barcode-card">
        <SnBarcode text="690123456789" :module-width="2" />
        <text class="sn-demo__meta">水平（默认）</text>
      </view>
      <view class="barcode-card">
        <SnBarcode text="690123456789" layout="vertical" :module-width="2" height="80rpx" />
        <text class="sn-demo__meta">垂直</text>
      </view>
    </view>

    <text class="sn-demo__title">样式属性</text>
    <view class="barcode-card barcode-card--tinted">
      <SnBarcode text="690123456789" :module-width="2" line-length="80rpx" />
    </view>
    <view class="barcode-card barcode-card--tinted">
      <SnBarcode text="690123456789" :module-width="2" line-color="#e02020" />
    </view>
    <view class="barcode-card barcode-card--tinted">
      <SnBarcode
        text="690123456789"
        :module-width="2"
        background="var(--sn-mp-color-background-muted)"
      />
    </view>
    <view class="barcode-card barcode-card--tinted">
      <SnBarcode text="690123456789" :module-width="2" text-align="left" margin="16rpx" />
    </view>
    <text class="sn-demo__meta">line-length / line-color / background / text-align / margin</text>
  </view>
</template>

<style scoped>
.barcode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}

.barcode-card--tinted {
  align-items: stretch;
}

.barcode-row {
  display: flex;
  flex-direction: row;
  gap: var(--sn-mp-spacing-3);
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
