<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — download.
 *
 * Default behaviour uses `<a download>`; here `on-download` takes over to
 * simulate an authenticated / blob download flow (fetch → object URL) and
 * reports the outcome below the player.
 */
import { ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';
import type { SnBridgeSource } from '@snui/vue-web';

const VIDEO =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

const status = ref('尚未触发下载');
const busy = ref(false);
const objectUrls: string[] = [];

async function customDownload(source: SnBridgeSource): Promise<string> {
  busy.value = true;
  status.value = '正在取流…';
  try {
    const response = await fetch(source.src);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    objectUrls.push(url);
    status.value = `已取得 ${(blob.size / 1024 / 1024).toFixed(2)} MB，浏览器开始保存`;
    return url;
  } catch (err) {
    status.value = `取流失败：${err instanceof Error ? err.message : String(err)}`;
    throw err;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="demo-stack">
    <SnVideoPlayer :src="VIDEO" title="下载演示" :on-download="customDownload" @download="() => (status = busy ? status : '已触发下载')" />
    <p class="demo-hint">
      点击控制条中的下载按钮：本 demo 用 <code>on-download</code> 接管为 fetch → blob
      → objectURL（模拟鉴权下载）。状态：{{ status }}
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary, #666);
  font-size: 12px;
}
</style>
