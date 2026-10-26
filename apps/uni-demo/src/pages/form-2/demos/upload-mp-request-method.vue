<script setup lang="ts">
/**
 * Demo: sn-upload — action / header / name / formData / buildFormData / uploadMethod / autoUpload / submit。
 *
 * `action` / `header` / `name` / `formData` 是 `uni.uploadFile` 的参数；
 * `build-form-data` 按文件动态拼 multipart；`upload-method` 直接接管传输、
 * 绕过 `uni.uploadFile` —— 这里用延时 Promise 模拟，不发任何网络请求。
 * `auto-upload=false` 时选完不自动传，改由 expose 的 `submit()` 触发。
 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const uploader = ref<InstanceType<typeof SnUpload> | null>(null);

/** 待上传：autoUpload=false，等 submit() 触发。 */
const pending = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/req-a/200',
    name: 'a.png',
    status: 'pending',
    percent: 0,
  },
  {
    uid: 2,
    url: 'https://picsum.photos/seed/req-b/200',
    name: 'b.png',
    status: 'pending',
    percent: 0,
  },
]);

/** 传输中 / 已完成 / 失败：三种 status 的列表形态。 */
const mixed = ref<UploadFileItem[]>([
  {
    uid: 3,
    url: 'https://picsum.photos/seed/req-c/200',
    name: 'c.png',
    status: 'loading',
    percent: 45,
  },
  {
    uid: 4,
    url: 'https://picsum.photos/seed/req-d/200',
    name: 'd.png',
    status: 'success',
    percent: 100,
    response: '{"id":"d"}',
  },
  { uid: 5, url: 'https://picsum.photos/seed/req-e/200', name: 'e.png', status: 'fail' },
]);

const lastResult = ref('—');

/**
 * 自定义传输：延时 Promise，不发网络请求。
 * 返回值为后端响应体，组件会写进 file.response。
 */
function simulateUpload(file: UploadFileItem): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: `mock-${file.uid}`, name: file.name ?? '' }), 400);
  });
}

/** 按文件拼 multipart：文件名里的扩展名决定 `kind` 字段。 */
function buildFormData(file: UploadFileItem): Record<string, unknown> {
  const name = file.name ?? '';
  return {
    kind: name.endsWith('.png') ? 'image' : 'other',
    uid: String(file.uid),
  };
}

async function runSubmit(): Promise<void> {
  lastResult.value = 'submit() 已触发';
  await uploader.value?.submit();
}

function onSuccess(payload: { file: UploadFileItem; response: unknown }): void {
  lastResult.value = `success: ${payload.file.name ?? payload.file.uid} → ${JSON.stringify(payload.response)}`;
}

function onFail(payload: { file: UploadFileItem; error: unknown }): void {
  lastResult.value = `fail: ${payload.file.name ?? payload.file.uid}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">uploadMethod + buildFormData（模拟传输，不发请求）</text>
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
    <text class="sn-demo__meta"
      >autoUpload=false：选完保持 pending，点下面按钮调 expose 的 submit()</text
    >
    <view class="sn-demo__action" @tap="runSubmit">
      <text class="sn-demo__action-text">submit()</text>
    </view>

    <text class="sn-demo__title">列表状态：pending / loading / success / fail</text>
    <SnUpload :file-list="mixed" :upload-method="simulateUpload" :auto-upload="false" :limit="6" />
    <text class="sn-demo__meta">loading 项盖进度遮罩显示百分比，fail 项描边成危险色</text>

    <text class="sn-demo__meta">最近结果：{{ lastResult }}</text>
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
