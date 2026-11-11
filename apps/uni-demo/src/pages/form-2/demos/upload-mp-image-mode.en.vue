<script setup lang="ts">
/**
 * Demo: sn-upload — thumbnail mode: `image-mode` is forwarded straight to the
 * thumbnail's `<image mode>` (`aspectFit` shows the whole image, `aspectFill`
 * crops to fill, `widthFix` sizes by width).
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
    <SnUpload v-model:file-list="photos" :image-mode="'aspectFit'" :limit="4" :auto-upload="false" />
    <text class="sn-demo__meta"
      >imageMode="aspectFit": the whole image stays visible, no cropping</text
    >

    <SnUpload :file-list="photos" :image-mode="'aspectFill'" :limit="4" :auto-upload="false" />
    <text class="sn-demo__meta">imageMode="aspectFill": fills the tile and crops</text>
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
