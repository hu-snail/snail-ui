<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — size / margin / export.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue'

const qrRef = ref<{ exportImage: () => Promise<string> } | null>(null)
const exported = ref('—')

async function onExport() {
  if (qrRef.value === null) return
  try {
    exported.value = await qrRef.value.exportImage()
  } catch (error) {
    const code = (error as { code?: string }).code ?? 'EXPORT_FAILED'
    exported.value = `export unavailable (${code})`
  }
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnQrCode ref="qrRef" text="https://snui.dev/export" :size="200" :margin="12" />
    <SnButton size="small" @tap="onExport">Export image</SnButton>
    <text class="sn-demo__meta">exportImage resolves with the temp file path: {{ exported }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  word-break: break-all;
}
</style>
