<script setup lang="ts">
/**
 * Demo: sn-upload — imageMode / customEvokeClass / customPreviewClass / customClass / customStyle.
 *
 * `image-mode` is forwarded straight to the thumbnail's `<image mode>`
 * (`aspectFit` shows the whole image, `aspectFill` crops to fill, `widthFix`
 * sizes by width). `custom-evoke-class` lands on the picker tile,
 * `custom-preview-class` on each file tile and `custom-class` / `custom-style`
 * on the root — three independent layers that never override each other.
 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const photos = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/id/1015/400/300',
    name: 'wide.jpg',
    status: 'success',
    percent: 100,
  },
  {
    uid: 2,
    url: 'https://picsum.photos/id/1016/300/400',
    name: 'tall.jpg',
    status: 'success',
    percent: 100,
  },
]);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnUpload
      v-model:file-list="photos"
      :image-mode="'aspectFit'"
      custom-evoke-class="sn-demo__evoke"
      custom-preview-class="sn-demo__tile"
      custom-class="sn-demo__upload"
      custom-style="padding: 16rpx; border-radius: var(--sn-mp-radius-lg); background-color: var(--sn-mp-color-background-soft);"
      :limit="4"
      :auto-upload="false"
    />
    <text class="sn-demo__meta"
      >imageMode="aspectFit": the whole image stays visible, no cropping</text
    >

    <SnUpload
      :file-list="photos"
      :image-mode="'aspectFill'"
      custom-preview-class="sn-demo__tile"
      :limit="4"
      :auto-upload="false"
    />
    <text class="sn-demo__meta">imageMode="aspectFill": fills the tile and crops</text>

    <text class="sn-demo__meta"
      >customEvokeClass restyles the picker tile, customPreviewClass the file tiles, customClass /
      customStyle the root</text
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
/* custom-class lands on the sn-upload root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__upload) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
/* custom-evoke-class / custom-preview-class land on the tile nodes. */
.sn-demo :deep(.sn-demo__evoke) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo :deep(.sn-demo__tile) {
  border-radius: var(--sn-mp-radius-md);
  box-shadow: var(--sn-mp-shadow-xs);
}
</style>
