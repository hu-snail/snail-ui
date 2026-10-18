<script setup lang="ts">
/** Demo: SnQrCode — download via the hover toolbar or an explicit button. */
import { ref } from 'vue'
import { SnButton, SnQrCode } from '@snui/vue-web'

const qrRoot = ref<HTMLElement | null>(null)

function downloadManually(): void {
  const canvas = qrRoot.value?.querySelector('canvas')
  if (!canvas) return
  let url: string
  try {
    url = canvas.toDataURL('image/png')
  } catch {
    return
  }
  const anchor = document.createElement('a')
  anchor.download = 'qrcode.png'
  anchor.href = url
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
</script>

<template>
  <div class="demo-col">
    <div ref="qrRoot" class="qr-slot">
      <SnQrCode value="https://snail.aui" :show-toolbar="true" />
    </div>
    <p class="hint">悬停二维码使用右上角浮动工具条下载，或：</p>
    <SnButton size="small" @click="downloadManually">下载 PNG</SnButton>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.hint { margin: 0; color: var(--sn-web-color-text-secondary); font-size: 13px; }
</style>
