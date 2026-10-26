<script setup lang="ts">
/**
 * upload-web-dragger — `dragger` mode: a full dashed drop area instead of the
 * compact trigger, a simulated upload driver that writes `percentage` on the
 * live entry (so the built-in progress bar animates), and click-to-preview
 * for an accepted entry.
 *
 * The driver is a stand-in for a real XHR/fetch: it mutates the reactive
 * entry the component handed it, which is exactly what a host driver does.
 * Every interval is cleared on unmount (AGENTS.md §41).
 */
import { onBeforeUnmount, ref } from 'vue';
import { SnButton, SnUpload } from '@snui/vue-web';
import type { SnUploadFile } from '@snui/vue-web';

const files = ref<SnUploadFile[]>([]);
const previewed = ref<SnUploadFile | null>(null);

/** Pending simulated-upload intervals, cleared on unmount. */
const timers = new Set<number>();

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Simulated driver: resolves at 100%, rejects for `*.err` files. */
function simulateUpload(file: SnUploadFile): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + 6 + Math.round(Math.random() * 14));
      file.percentage = value;
      if (value < 100) return;
      window.clearInterval(id);
      timers.delete(id);
      if (file.name.toLowerCase().endsWith('.err')) reject(new Error('upload failed'));
      else resolve();
    }, 140);
    timers.add(id);
  });
}

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearInterval(id));
  timers.clear();
});
</script>

<template>
  <div class="upload-demo">
    <SnUpload
      dragger
      multiple
      list-type="image"
      :custom-request="simulateUpload"
      @change="(list: SnUploadFile[]) => (files = list)"
      @preview="(file: SnUploadFile) => (previewed = file)"
    />

    <div class="upload-demo__status">
      <span>
        已选 {{ files.length }} 个 ·
        {{ files.filter((file) => file.status === 'uploading').length }} 个上传中
      </span>
      <SnButton v-if="previewed" text size="small" @click="previewed = null"> 关闭预览 </SnButton>
    </div>

    <div v-if="previewed" class="upload-demo__preview">
      <img
        v-if="previewed.url"
        class="upload-demo__thumb"
        :src="previewed.url"
        :alt="previewed.name"
      />
      <div class="upload-demo__meta">
        <strong>{{ previewed.name }}</strong>
        <span
          >{{ formatSize(previewed.size) }} · {{ previewed.status }} ·
          {{ previewed.percentage ?? 0 }}%</span
        >
      </div>
    </div>

    <p class="upload-demo__hint">
      点击条目名称或右侧眼镜图标预览；文件名以 <code>.err</code> 结尾演示上传失败。
    </p>
  </div>
</template>

<style scoped>
.upload-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.upload-demo__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.upload-demo__preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}

.upload-demo__thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.upload-demo__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.upload-demo__meta strong {
  color: var(--sn-web-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.upload-demo__hint code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
