<script setup lang="ts">
/** Demo: SnQrCode — download via the hover toolbar or an explicit button. */
import { ref } from 'vue';
import { SnButton, SnQrCode } from '@snui/vue-web';

const qrRoot = ref<HTMLElement | null>(null);

function downloadManually(): void {
  const canvas = qrRoot.value?.querySelector('canvas');
  if (!canvas) return;
  let url: string;
  try {
    url = canvas.toDataURL('image/png');
  } catch {
    return;
  }
  const anchor = document.createElement('a');
  anchor.download = 'qrcode.png';
  anchor.href = url;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
</script>

<template>
  <div class="demo-col">
    <div ref="qrRoot" class="qr-slot">
      <SnQrCode value="https://snail.aui" :show-toolbar="true" />
    </div>
    <p class="hint">
      Hover the QR code to download from the floating toolbar at its top right, or:
    </p>
    <SnButton size="small" @click="downloadManually">Download PNG</SnButton>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
}
.hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
</style>
