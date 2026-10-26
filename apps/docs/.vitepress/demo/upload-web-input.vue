<script setup lang="ts">
/**
 * upload-web-input — 「输入框 + 上传」组合。
 *
 * A read-only `SnInput` mirrors the picked file names, and the adjacent
 * `SnUpload` (compact trigger, its own list hidden) drives one simulated
 * upload per file. The host renders the animated list itself from the
 * mirrored entries, so it can use `SnProgress` for the bar and open a real
 * preview dialog on click.
 *
 * Why the host renders the list: `change` hands over the live reactive
 * entries, so `file.percentage` written by the driver re-renders the host's
 * list too — the same pattern a host app would use to own presentation while
 * the component owns the pick/accept/status state machine.
 *
 * `重置` remounts the uploader through `:key` so the component's internal
 * list is cleared together with the mirror (the component owns its list, so
 * there is nothing to clear from the outside).
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import { SnButton, SnInput, SnProgress, SnUpload } from '@snui/vue-web';
import type { SnUploadFile } from '@snui/vue-web';

const files = ref<SnUploadFile[]>([]);
const previewed = ref<SnUploadFile | null>(null);
const previewOpen = ref(false);
const uploadKey = ref(0);
const timers = new Set<number>();

const summary = computed(() =>
  files.value.length > 0 ? files.value.map((file) => file.name).join('、') : '',
);

const uploadingCount = computed(
  () => files.value.filter((file) => file.status === 'uploading').length,
);

const totalSize = computed(() => files.value.reduce((sum, file) => sum + file.size, 0));

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Bar percentage: the driver's live value, or the terminal state. */
function percentageOf(file: SnUploadFile): number {
  if (typeof file.percentage === 'number') return file.percentage;
  return file.status === 'done' ? 100 : 0;
}

function statusOf(file: SnUploadFile): 'default' | 'success' | 'error' {
  if (file.status === 'error') return 'error';
  if (file.status === 'done') return 'success';
  return 'default';
}

/** Simulated driver — writes `percentage` on the live reactive entry. */
function simulateUpload(file: SnUploadFile): Promise<void> {
  return new Promise<void>((resolve) => {
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + 10 + Math.round(Math.random() * 12));
      file.percentage = value;
      if (value < 100) return;
      window.clearInterval(id);
      timers.delete(id);
      resolve();
    }, 150);
    timers.add(id);
  });
}

function onChange(list: SnUploadFile[]): void {
  files.value = list;
}

function openPreview(file: SnUploadFile): void {
  previewed.value = file;
  previewOpen.value = true;
}

function reset(): void {
  timers.forEach((id) => window.clearInterval(id));
  timers.clear();
  files.value = [];
  previewOpen.value = false;
  previewed.value = null;
  uploadKey.value += 1;
}

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearInterval(id));
  timers.clear();
});
</script>

<template>
  <div class="upload-input-demo">
    <div class="upload-input-demo__row">
      <SnInput :model-value="summary" readonly placeholder="还没有选择文件" aria-label="已选文件" />
      <SnUpload
        :key="uploadKey"
        multiple
        :show-file-list="false"
        :custom-request="simulateUpload"
        :on-preview="openPreview"
        @change="onChange"
      >
        <template #trigger>
          <span class="upload-input-demo__trigger">选择文件</span>
        </template>
      </SnUpload>
    </div>

    <ul v-if="files.length > 0" class="upload-input-demo__list">
      <li v-for="file in files" :key="file.id" class="upload-input-demo__item">
        <button
          type="button"
          class="upload-input-demo__name"
          :title="file.name"
          @click="openPreview(file)"
        >
          {{ file.name }}
        </button>
        <span class="upload-input-demo__size">{{ formatSize(file.size) }}</span>
        <SnProgress
          class="upload-input-demo__progress"
          :percentage="percentageOf(file)"
          :status="statusOf(file)"
          :processing="file.status === 'uploading'"
          :height="4"
          :show-indicator="false"
        />
        <SnButton text size="tiny" @click="openPreview(file)">预览</SnButton>
      </li>
    </ul>

    <div class="upload-input-demo__footer">
      <span>
        {{
          uploadingCount > 0
            ? `${uploadingCount} 个文件上传中…`
            : files.length > 0
              ? `共 ${files.length} 个文件 · ${formatSize(totalSize)}`
              : '点击「选择文件」后开始上传'
        }}
      </span>
      <SnButton v-if="files.length > 0" text size="tiny" @click="reset">重置</SnButton>
    </div>

    <DialogStage v-model:show="previewOpen">
      <SnDialog
        :title="previewed?.name ?? '文件预览'"
        positive-text="完成"
        @positive-click="previewOpen = false"
        @negative-click="previewOpen = false"
        @close="previewOpen = false"
      >
        <div class="upload-input-demo__preview">
          <img
            v-if="previewed?.url"
            class="upload-input-demo__thumb"
            :src="previewed.url"
            :alt="previewed.name"
          />
          <dl class="upload-input-demo__meta">
            <dt>名称</dt>
            <dd>{{ previewed?.name }}</dd>
            <dt>类型</dt>
            <dd>{{ previewed?.type || '未知' }}</dd>
            <dt>大小</dt>
            <dd>{{ previewed ? formatSize(previewed.size) : '' }}</dd>
            <dt>状态</dt>
            <dd>
              {{ previewed?.status }}
              <template v-if="previewed && typeof previewed.percentage === 'number'">
                · {{ previewed.percentage }}%
              </template>
            </dd>
          </dl>
        </div>
      </SnDialog>
    </DialogStage>
  </div>
</template>

<style scoped>
.upload-input-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.upload-input-demo__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-input-demo__row :deep(.sn-input) {
  flex: 1;
  min-width: 0;
}

.upload-input-demo__trigger {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.upload-input-demo__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.upload-input-demo__item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  font-size: 13px;
}

.upload-input-demo__name {
  flex: 0 1 auto;
  max-width: 46%;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
  color: var(--sn-web-color-text-primary);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-input-demo__name:hover {
  color: var(--sn-web-color-action-primary);
}

.upload-input-demo__size {
  flex-shrink: 0;
  color: var(--sn-web-color-text-tertiary);
}

.upload-input-demo__progress {
  flex: 1;
  min-width: 60px;
}

.upload-input-demo__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.upload-input-demo__preview {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.upload-input-demo__thumb {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
  flex-shrink: 0;
}

.upload-input-demo__meta {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  margin: 0;
  font-size: 13px;
}

.upload-input-demo__meta dt {
  color: var(--sn-web-color-text-tertiary);
}

.upload-input-demo__meta dd {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  overflow-wrap: anywhere;
}
</style>
