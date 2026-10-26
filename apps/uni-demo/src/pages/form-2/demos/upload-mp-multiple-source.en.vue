<script setup lang="ts">
/**
 * Demo: sn-upload — multiple / sourceType / sizeType / accept / limit / showLimitNum.
 *
 * `multiple` lets the picker return several files at once; `source-type` limits
 * where they come from (album / camera); `size-type` picks original vs
 * compressed; `accept` chooses which picker API is called; `limit` plus
 * `show-limit-num` render the "current / max" counter and hide the picker tile
 * once full.
 *
 * The docs preview has no uni runtime, so tapping the picker tile only emits
 * `chooseerror`; these cases focus on the parameter combinations and the
 * at-limit shape.
 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

/** Album multi-select, up to 6 images. */
const album = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/multi-a/200',
    name: 'a.png',
    status: 'success',
    percent: 100,
  },
]);

/** Camera only, original size: both sourceType and sizeType are narrowed. */
const camera = ref<UploadFileItem[]>([]);

/** File picker (accept="file") already at its limit: the picker tile is gone. */
const files = ref<UploadFileItem[]>([
  {
    uid: 2,
    url: 'https://picsum.photos/seed/multi-b/200',
    name: 'b.pdf',
    status: 'success',
    percent: 100,
  },
  {
    uid: 3,
    url: 'https://picsum.photos/seed/multi-c/200',
    name: 'c.pdf',
    status: 'success',
    percent: 100,
  },
]);

const lastError = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">multiple + limit=6 + showLimitNum</text>
    <SnUpload
      v-model:file-list="album"
      action="/api/upload"
      multiple
      :limit="6"
      :max-size="5242880"
      :auto-upload="false"
      @chooseerror="lastError = String($event)"
    />
    <text class="sn-demo__meta"
      >multiple picks several at once; at limit=6 the picker tile disappears and the counter stops
      at 6/6</text
    >

    <text class="sn-demo__title">sourceType=['camera'] + sizeType=['original']</text>
    <SnUpload
      v-model:file-list="camera"
      action="/api/upload"
      :source-type="['camera']"
      :size-type="['original']"
      :limit="1"
      :auto-upload="false"
      @chooseerror="lastError = String($event)"
    />
    <text class="sn-demo__meta"
      >sourceType narrowed to the camera; sizeType keeps originals only</text
    >

    <text class="sn-demo__title">accept="file" already at the limit</text>
    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      accept="file"
      :limit="2"
      :auto-upload="false"
      @chooseerror="lastError = String($event)"
    />
    <text class="sn-demo__meta"
      >accept="file" uses the file picker; 2/2 is full, so only the remove controls remain</text
    >

    <text class="sn-demo__meta">chooseerror payload: {{ lastError }}</text>
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
</style>
