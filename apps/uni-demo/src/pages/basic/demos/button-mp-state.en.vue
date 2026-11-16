<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — disabled state (semantic hues + variant forms).
 * Loading states live in the dedicated loading module.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Disabled (× semantic hues)</text>
    <view class="sn-demo__row">
      <SnButton disabled>Default button</SnButton>
      <SnButton disabled type="primary">Primary button</SnButton>
      <SnButton disabled type="success">Success button</SnButton>
      <SnButton disabled type="info">Info button</SnButton>
      <SnButton disabled type="warning">Warning button</SnButton>
      <SnButton disabled type="danger">Danger button</SnButton>
    </view>

    <text class="sn-demo__label">Disabled (× variants: plain / soft / dashed / hairline)</text>
    <view class="sn-demo__row">
      <SnButton disabled variant="plain" type="primary">Plain disabled</SnButton>
      <SnButton disabled variant="soft" type="primary">Soft disabled</SnButton>
      <SnButton disabled variant="dashed" type="primary">Dashed disabled</SnButton>
      <SnButton disabled>Hairline disabled</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
