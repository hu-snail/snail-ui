<script setup lang="ts">
/**
 * upload-web-dialog — 弹窗上传：a button opens a modal whose body is a
 * `dragger` uploader. The dialog is the docs' `DialogStage` shell (mask +
 * teleport + Esc), the same one the dialog demos use; the card inside is the
 * real `SnDialog`.
 *
 * `完成` closes the modal and the page keeps the last accepted list, so the
 * pattern "上传完成后回到页面" is visible.
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import { SnButton, SnDialog, SnUpload } from '@snui/vue-web';
import type { SnUploadFile } from '@snui/vue-web';

const open = ref(false);
const files = ref<SnUploadFile[]>([]);
/** Files accepted in the current dialog session (committed on 完成). */
const committed = ref<SnUploadFile[]>([]);
const previewed = ref<SnUploadFile | null>(null);
const timers = new Set<number>();

const uploadingCount = computed(
  () => files.value.filter((file) => file.status === 'uploading').length,
);

const failureCount = computed(() => files.value.filter((file) => file.status === 'error').length);

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Simulated driver: three quick ticks, then done (or error for `*.err`). */
function simulateUpload(file: SnUploadFile): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + 20 + Math.round(Math.random() * 20));
      file.percentage = value;
      if (value < 100) return;
      window.clearInterval(id);
      timers.delete(id);
      if (file.name.toLowerCase().endsWith('.err')) reject(new Error('upload failed'));
      else resolve();
    }, 220);
    timers.add(id);
  });
}

function openDialog(): void {
  files.value = [];
  previewed.value = null;
  open.value = true;
}

function confirm(): void {
  committed.value = files.value.filter((file) => file.status === 'done');
  open.value = false;
}

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearInterval(id));
  timers.clear();
});
</script>

<template>
  <div class="upload-dialog-demo">
    <SnButton type="primary" @click="openDialog">上传附件</SnButton>

    <p v-if="committed.length > 0" class="upload-dialog-demo__committed">
      已提交 {{ committed.length }} 个文件：{{ committed.map((file) => file.name).join('、') }}
    </p>
    <p v-else class="upload-dialog-demo__committed">尚未提交任何附件。</p>

    <DialogStage v-model:show="open">
      <SnDialog
        title="上传附件"
        :positive-text="uploadingCount > 0 ? '上传中…' : '完成'"
        negative-text="取消"
        @positive-click="confirm"
        @negative-click="open = false"
        @close="open = false"
      >
        <div class="upload-dialog-demo__body">
          <SnUpload
            dragger
            multiple
            list-type="image"
            accept="image/*,.pdf"
            :custom-request="simulateUpload"
            @change="(list: SnUploadFile[]) => (files = list)"
            @preview="(file: SnUploadFile) => (previewed = file)"
          />

          <div class="upload-dialog-demo__summary">
            <span>共 {{ files.length }} 个文件</span>
            <span v-if="uploadingCount > 0">· {{ uploadingCount }} 个上传中</span>
            <span v-if="failureCount > 0" class="upload-dialog-demo__error">
              · {{ failureCount }} 个失败
            </span>
          </div>

          <div v-if="previewed" class="upload-dialog-demo__preview">
            <img
              v-if="previewed.url"
              class="upload-dialog-demo__thumb"
              :src="previewed.url"
              :alt="previewed.name"
            />
            <div class="upload-dialog-demo__meta">
              <strong>{{ previewed.name }}</strong>
              <span>{{ formatSize(previewed.size) }} · {{ previewed.status }}</span>
            </div>
            <SnButton text size="tiny" @click="previewed = null">收起</SnButton>
          </div>
        </div>
      </SnDialog>
    </DialogStage>
  </div>
</template>

<style scoped>
.upload-dialog-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.upload-dialog-demo__committed {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.upload-dialog-demo__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.upload-dialog-demo__summary {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}

.upload-dialog-demo__error {
  color: var(--sn-web-color-feedback-danger);
}

.upload-dialog-demo__preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}

.upload-dialog-demo__thumb {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.upload-dialog-demo__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  margin-right: auto;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.upload-dialog-demo__meta strong {
  color: var(--sn-web-color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
