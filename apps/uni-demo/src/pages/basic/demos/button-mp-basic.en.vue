<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — basic types.
 * Spacing note: uni-app x has no flex `gap` support (README device-verify
 * list) — inline `custom-style` margins + explicit `flex-direction: row`.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap">Default</SnButton>
      <SnButton :custom-style="rowGap" type="primary">Primary button</SnButton>
      <SnButton :custom-style="rowGap" type="success">Success button</SnButton>
      <SnButton :custom-style="rowGap" type="info">Info button</SnButton>
      <SnButton :custom-style="rowGap" type="warning">Warning button</SnButton>
      <SnButton :custom-style="rowGap" type="danger">Danger button</SnButton>
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
</style>
