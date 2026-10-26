<script setup lang="ts">
/**
 * Demo: sn-barcode (uni-end) — States and events: three error codes plus the
 * rendered callback. Encoding runs on mount, so invalid input reports
 * through the event stream immediately.
 */
import { ref } from 'vue';
import SnBarcode from '@snui/uni-src/components/sn-barcode/sn-barcode.vue';
import type {
  SnBarcodeEncoded,
  SnBarcodeEncodeError,
} from '@snui/uni-src/components/sn-barcode/sn-barcode-types';

interface ErrorCase {
  id: string;
  label: string;
  text: string;
}

const errorCases: ErrorCase[] = [
  { id: 'short', label: 'Too short ("1234")', text: '1234' },
  { id: 'checksum', label: 'Wrong 13th check digit', text: '5901234123458' },
];

const errorLog = ref<string[]>([]);
const renderedText = ref('—');

function onError(error: SnBarcodeEncodeError): void {
  errorLog.value.push(`${error.code}: ${error.message}`);
}

function onRendered(encoded: SnBarcodeEncoded): void {
  renderedText.value = encoded.displayText;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">Valid input → rendered</text>
    <view class="barcode-card">
      <SnBarcode text="690123456789" :module-width="2" @rendered="onRendered" />
    </view>
    <text class="sn-demo__meta">rendered payload displayText: {{ renderedText }}</text>

    <text class="sn-demo__title">Invalid input → error</text>
    <view v-for="item in errorCases" :key="item.id" class="error-case">
      <text class="sn-demo__meta">{{ item.label }}</text>
      <view class="barcode-card">
        <SnBarcode :text="item.text" :module-width="2" @error="onError" />
      </view>
    </view>

    <text class="sn-demo__title">Unsupported format (CODE128)</text>
    <view class="barcode-card">
      <SnBarcode text="690123456789" format="CODE128" :module-width="2" @error="onError" />
    </view>

    <view class="error-log">
      <text v-for="(line, index) in errorLog" :key="index" class="error-log__line">{{ line }}</text>
      <text v-if="errorLog.length === 0" class="error-log__line">No error events yet</text>
    </view>
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

.error-case {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}

.error-log {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  width: 100%;
  box-sizing: border-box;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.error-log__line {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-feedback-danger);
}
</style>
