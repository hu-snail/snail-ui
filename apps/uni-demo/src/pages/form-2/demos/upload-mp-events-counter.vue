<script setup lang="ts">
/**
 * Demo: sn-upload — change / remove / progress / showLimitNum=false 与 accept 变体。
 *
 * `change` 在列表每次变化时同 tick 触发（含删除），`remove` 带被删项与剩余列表；
 * `progress` 目前只是保留事件（组件用 `percent` 渲染遮罩，不逐字节上报）。
 * `show-limit-num=false` 关掉计数，`accept="media"` / `"all"` 是选择器开关。
 */
import { ref, computed } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const files = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/evt-a/200',
    name: 'a.png',
    status: 'success',
    percent: 100,
  },
  {
    uid: 2,
    url: 'https://picsum.photos/seed/evt-b/200',
    name: 'b.png',
    status: 'success',
    percent: 100,
  },
]);

const changeCount = ref(0);
const lastRemoved = ref('—');
const progressCount = ref(0);

const remaining = computed(
  () => files.value.map((file) => file.name || `#${file.uid}`).join('、') || '（空）',
);

function onChange(payload: { fileList: UploadFileItem[] }): void {
  changeCount.value += 1;
  void payload;
}

function onRemove(payload: { file: UploadFileItem; fileList: UploadFileItem[] }): void {
  lastRemoved.value = payload.file.name || `#${payload.file.uid}`;
}

function onProgress(): void {
  progressCount.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      accept="media"
      :limit="4"
      :show-limit-num="false"
      :auto-upload="false"
      @change="onChange"
      @remove="onRemove"
      @progress="onProgress"
    />
    <text class="sn-demo__meta"
      >showLimitNum=false：不渲染「当前 / 上限」计数；accept="media" 同时可选图片与视频</text
    >
    <text class="sn-demo__meta"
      >change 触发 {{ changeCount }} 次；最近删除：{{ lastRemoved }}；progress 触发
      {{ progressCount }} 次</text
    >
    <text class="sn-demo__meta">剩余：{{ remaining }}</text>

    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      accept="all"
      :limit="4"
      :show-limit-num="false"
      :auto-upload="false"
    />
    <text class="sn-demo__meta"
      >accept="all"：走通用文件选择器（与上面同一份列表，删除可跨实例观察）</text
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
