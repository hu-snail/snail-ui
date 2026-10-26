<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — 基础用法：12 位输入自动补算校验位。
 */
import { ref } from 'vue';
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
import type { SnBarcodeEncoded } from '@snui/uni-src/components/sn-barcode/sn-barcode-types';

const displayText = ref('—');

function onRendered(encoded: SnBarcodeEncoded): void {
  displayText.value = encoded.displayText;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="barcode-card">
      <SnBarcode text="690123456789" :module-width="2" @rendered="onRendered" />
    </view>
    <text class="sn-demo__meta">12 位输入，自动补算校验位：{{ displayText }}</text>
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

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
