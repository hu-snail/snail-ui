<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — disabled state (semantic hues + variant forms).
 * Loading states live in the dedicated loading module.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">Disabled (× semantic hues)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" disabled>Default button</SnButton>
      <SnButton :custom-style="rowGap" disabled type="primary">Primary button</SnButton>
      <SnButton :custom-style="rowGap" disabled type="success">Success button</SnButton>
      <SnButton :custom-style="rowGap" disabled type="info">Info button</SnButton>
      <SnButton :custom-style="rowGap" disabled type="warning">Warning button</SnButton>
      <SnButton :custom-style="rowGap" disabled type="danger">Danger button</SnButton>
    </view>

    <text class="sn-mp-btn-label">Disabled (× variants: plain / soft / dashed / hairline)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" disabled variant="plain" type="primary">Plain disabled</SnButton>
      <SnButton :custom-style="rowGap" disabled variant="soft" type="primary">Soft disabled</SnButton>
      <SnButton :custom-style="rowGap" disabled variant="dashed" type="primary">Dashed disabled</SnButton>
      <SnButton :custom-style="rowGap" disabled>Hairline disabled</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
