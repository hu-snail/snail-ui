<script setup lang="ts">
/**
 * Demo: sn-qr-code (uni-end) — 尺寸 / 边距 / 导出。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-qr-code from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnQrCode from '@snui/uni-src/components/sn-qr-code/sn-qr-code.vue';

const qrRef = ref<{ exportImage: () => Promise<string> } | null>(null);
const exported = ref('—');

async function onExport() {
  if (qrRef.value === null) return;
  try {
    const result = await qrRef.value.exportImage();
    // uni-app x 直接返回完整 PNG data URL，避免把上万字符铺进示例文字。
    exported.value = result.startsWith('data:image/')
      ? `${result.slice(0, 22)}…（共 ${result.length} 字符，可直接用于 <image :src>）`
      : result;
  } catch (error) {
    const code = (error as { code?: string }).code ?? 'EXPORT_FAILED';
    exported.value = `导出不可用（${code}）`;
  }
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnQrCode ref="qrRef" text="https://snui.dev/export" :size="200" :margin="12" />
    <SnButton size="small" @tap="onExport">导出图片</SnButton>
    <text class="sn-demo__meta">exportImage 返回临时文件路径或 data URL：{{ exported }}</text>
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
