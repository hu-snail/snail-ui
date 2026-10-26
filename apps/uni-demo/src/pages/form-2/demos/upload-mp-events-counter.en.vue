<script setup lang="ts">
/**
 * Demo: sn-upload — change / remove / progress / showLimitNum=false and accept variants.
 *
 * `change` fires in the same tick as every list mutation (removals included);
 * `remove` carries the removed entry plus the remaining list. `progress` is
 * currently a reserved event — the component renders the scrim from `percent`
 * and never reports byte-level progress. `show-limit-num=false` hides the
 * counter; `accept="media"` / `"all"` switch the picker.
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
  () => files.value.map((file) => file.name || `#${file.uid}`).join(', ') || '(empty)',
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
      >showLimitNum=false hides the "current / max" counter; accept="media" picks images and
      videos</text
    >
    <text class="sn-demo__meta"
      >change fired {{ changeCount }} times; last removed: {{ lastRemoved }}; progress fired
      {{ progressCount }} times</text
    >
    <text class="sn-demo__meta">Remaining: {{ remaining }}</text>

    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      accept="all"
      :limit="4"
      :show-limit-num="false"
      :auto-upload="false"
    />
    <text class="sn-demo__meta"
      >accept="all" uses the generic file picker (same list as above, so removals are observable
      across instances)</text
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
