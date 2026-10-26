<script setup lang="ts">
/**
 * Demo: sn-upload — beforeUpload / beforeChoose / beforeRemove / beforePreview / maxSize。
 *
 * 四个钩子都是「返回 false 即否决」的窄接口：
 *   - `beforeChoose` 在选择器打开前跑
 *   - `beforeUpload` 在每个被选中的文件进入列表前跑（可返回改写后的文件）
 *   - `beforeRemove` 在删除某项前跑 —— 预览里可直接验证：锁定的那项删不掉
 *   - `beforePreview` 在预览前跑 —— 预览里可直接验证：计数会涨，但不会真的开预览器
 * `max-size` 超限时组件发出 `oversize` 并跳过该文件。
 *
 * 预览环境没有 uni 运行时，点选择瓦片只会走 `chooseerror`，所以
 * beforeChoose / beforeUpload 的计数停在 0 —— 它们要真实选择器才会跑。
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

/** 每个文件进入列表前跑；返回 false 即丢弃。 */
function beforeUpload(file: UploadFileItem): boolean {
  uploadChecks.value += 1;
  log.value = `beforeUpload: ${file.name || file.uid}`;
  return true;
}

/** 锁定的那一项不允许删除 —— 预览里点它的 × 不会有反应。 */
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
      >点第二个 × 可删除；点第一个 × 被 beforeRemove 否决。点缩略图只触发 beforePreview。</text
    >
    <text class="sn-demo__meta">
      beforeChoose {{ chooseChecks }} / beforeUpload {{ uploadChecks }} / beforeRemove
      {{ removeChecks }} / beforePreview {{ previewChecks }}
    </text>
    <text class="sn-demo__meta">最近一次钩子：{{ log }}</text>
    <text class="sn-demo__meta">maxSize=5MB：超限文件不进入列表，改发 oversize</text>
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
