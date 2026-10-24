<script setup lang="ts">
/**
 * Demo: sn-upload — action / header / name / formData / buildFormData / uploadMethod / autoUpload / submit.
 *
 * `action` / `header` / `name` / `formData` are `uni.uploadFile` parameters;
 * `build-form-data` assembles multipart per file; `upload-method` takes over
 * the transfer entirely and bypasses `uni.uploadFile` — simulated here with a
 * delayed Promise, no network request at all. With `auto-upload=false` picking
 * does not transfer; the exposed `submit()` starts it.
 */
import { ref } from 'vue'
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue'
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types'

const uploader = ref<InstanceType<typeof SnUpload> | null>(null)

/** Pending: autoUpload=false, waiting for submit(). */
const pending = ref<UploadFileItem[]>([
  { uid: 1, url: 'https://picsum.photos/seed/req-a/200', name: 'a.png', status: 'pending', percent: 0 },
  { uid: 2, url: 'https://picsum.photos/seed/req-b/200', name: 'b.png', status: 'pending', percent: 0 },
])

/** In-flight / done / failed: the three list shapes. */
const mixed = ref<UploadFileItem[]>([
  { uid: 3, url: 'https://picsum.photos/seed/req-c/200', name: 'c.png', status: 'loading', percent: 45 },
  { uid: 4, url: 'https://picsum.photos/seed/req-d/200', name: 'd.png', status: 'success', percent: 100, response: '{"id":"d"}' },
  { uid: 5, url: 'https://picsum.photos/seed/req-e/200', name: 'e.png', status: 'fail' },
])

const lastResult = ref('—')

/**
 * Custom transfer: a delayed Promise, no network request.
 * The resolved value becomes the backend response stored on `file.response`.
 */
function simulateUpload(file: UploadFileItem): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: `mock-${file.uid}`, name: file.name ?? '' }), 400)
  })
}

/** Per-file multipart: the extension decides the `kind` field. */
function buildFormData(file: UploadFileItem): Record<string, unknown> {
  const name = file.name ?? ''
  return {
    kind: name.endsWith('.png') ? 'image' : 'other',
    uid: String(file.uid),
  }
}

async function runSubmit(): Promise<void> {
  lastResult.value = 'submit() fired'
  await uploader.value?.submit()
}

function onSuccess(payload: { file: UploadFileItem, response: unknown }): void {
  lastResult.value = `success: ${payload.file.name ?? payload.file.uid} → ${JSON.stringify(payload.response)}`
}

function onFail(payload: { file: UploadFileItem, error: unknown }): void {
  lastResult.value = `fail: ${payload.file.name ?? payload.file.uid}`
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">uploadMethod + buildFormData (simulated transfer, no request)</text>
    <SnUpload
      ref="uploader"
      v-model:file-list="pending"
      action="/api/upload"
      name="avatar"
      :header="{ 'X-Trace': 'demo' }"
      :form-data="{ scene: 'profile' }"
      :build-form-data="buildFormData"
      :upload-method="simulateUpload"
      :auto-upload="false"
      :limit="4"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta">autoUpload=false: picked files stay pending; the button below calls the exposed submit()</text>
    <view class="sn-demo__action" @tap="runSubmit">
      <text class="sn-demo__action-text">submit()</text>
    </view>

    <text class="sn-demo__title">List states: pending / loading / success / fail</text>
    <SnUpload
      :file-list="mixed"
      :upload-method="simulateUpload"
      :auto-upload="false"
      :limit="6"
    />
    <text class="sn-demo__meta">loading tiles show a progress scrim with the percentage; failed tiles get a danger border</text>

    <text class="sn-demo__meta">Last result: {{ lastResult }}</text>
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
.sn-demo__title {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__action {
  align-self: flex-start;
  padding: 0 var(--sn-mp-spacing-4);
  min-height: 64rpx;
  display: flex;
  align-items: center;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__action-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
