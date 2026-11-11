<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — Barcode formats: the `format` values.
 */
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="barcode-card">
      <SnBarcode text="HELLO123$%+" format="CODE128" :module-width="2" />
      <SnBarcode text="HELLO123-" format="CODE39" :module-width="2" />
      <SnBarcode text="690123456789" format="EAN13" :module-width="2" />
      <SnBarcode text="A123456789B" format="CODEBAR" :module-width="2" />
      <SnBarcode text="12345678" format="ITF" :module-width="2" />
      <SnBarcode text="69012345" format="EAN8" :module-width="2" />
      <SnBarcode text="012345678905" format="UPC" :module-width="2" />
    </view>
    <text class="sn-demo__meta"
      >EAN series auto-computes the check digit; invalid input goes through the error event</text
    >
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

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
