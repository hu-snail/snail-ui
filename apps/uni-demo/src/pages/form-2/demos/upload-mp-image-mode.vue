<script setup lang="ts">
/**
 * Demo: sn-upload — 缩略图模式：imageMode 直接透传给缩略图的 `<image mode>`
 * （aspectFit 完整显示、aspectFill 裁切填满、widthFix 按宽定高）。
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
      :limit="4"
      :auto-upload="false"
    />
    <text class="sn-demo__meta">imageMode="aspectFit"：整图完整显示，不裁切</text>

    <SnUpload :file-list="photos" :image-mode="'aspectFill'" :limit="4" :auto-upload="false" />
    <text class="sn-demo__meta">imageMode="aspectFill"：铺满瓦片并裁切</text>
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
