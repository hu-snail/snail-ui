<script setup lang="ts">
/**
 * Demo: sn-upload — beforeUpload / beforeChoose / beforeRemove / beforePreview / maxSize.
 *
 * All four hooks are narrow "return false to veto" interfaces:
 *   - `beforeChoose` runs before the picker opens
 *   - `beforeUpload` runs per chosen file before it enters the list (it may
 *     return a rewritten file)
 *   - `beforeRemove` runs before a row is deleted — verifiable in the preview:
 *     the locked entry cannot be removed
 *   - `beforePreview` runs before a preview — verifiable in the preview: the
 *     counter grows, but no previewer opens
 * When a file exceeds `max-size` the component emits `oversize` and skips it.
 *
 * The preview has no uni runtime, so tapping the picker tile only goes through
 * `chooseerror`; the beforeChoose / beforeUpload counters stay at 0 because
 * they need a real picker.
 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const lockedUid = 1;
const files = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/hook-a/200',
    name: 'locked.png',
    status: 'success',
    percent: 100,
  },
  {
    uid: 2,
    url: 'https://picsum.photos/seed/hook-b/200',
    name: 'removable.png',
    status: 'success',
    percent: 100,
  },
]);

const chooseChecks = ref(0);
const uploadChecks = ref(0);
const removeChecks = ref(0);
const previewChecks = ref(0);
const log = ref('—');

function beforeChoose(): boolean {
  chooseChecks.value += 1;
  return true;
}

/** Runs before each chosen file enters the list; false drops it. */
function beforeUpload(file: UploadFileItem): boolean {
  uploadChecks.value += 1;
  log.value = `beforeUpload: ${file.name || file.uid}`;
  return true;
}

/** The locked entry may not be removed — tapping its × does nothing. */
function beforeRemove(file: UploadFileItem): boolean {
  removeChecks.value += 1;
  log.value = `beforeRemove: ${file.name || file.uid}`;
  return file.uid !== lockedUid;
}

function beforePreview(file: UploadFileItem): boolean {
  previewChecks.value += 1;
  log.value = `beforePreview: ${file.name || file.uid}`;
  return true;
}

function onOversize(payload: { file: UploadFileItem; maxSize: number }): void {
  log.value = `oversize: ${payload.file.name || payload.file.uid} > ${payload.maxSize}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      :max-size="5242880"
      :auto-upload="false"
      :before-choose="beforeChoose"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :before-preview="beforePreview"
      @oversize="onOversize"
    />
    <text class="sn-demo__meta"
      >The second × removes its row; the first × is vetoed by beforeRemove. Tapping a thumb only
      fires beforePreview.</text
    >
    <text class="sn-demo__meta">
      beforeChoose {{ chooseChecks }} / beforeUpload {{ uploadChecks }} / beforeRemove
      {{ removeChecks }} / beforePreview {{ previewChecks }}
    </text>
    <text class="sn-demo__meta">Last hook: {{ log }}</text>
    <text class="sn-demo__meta"
      >maxSize=5MB: oversized files never enter the list and emit oversize instead</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
