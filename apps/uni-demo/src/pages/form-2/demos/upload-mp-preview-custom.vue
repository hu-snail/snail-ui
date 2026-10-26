<script setup lang="ts">
/**
 * Demo: sn-upload — imageMode / customEvokeClass / customPreviewClass / customClass / customStyle。
 *
 * `image-mode` 直接透传给缩略图的 `<image mode>`（`aspectFit` 完整显示、
 * `aspectFill` 裁切填满、`widthFix` 按宽定高）。`custom-evoke-class` 落在选择
 * 瓦片上，`custom-preview-class` 落在每个文件瓦片上，`custom-class` /
 * `custom-style` 落在根节点上 —— 三层各自独立，互不覆盖。
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
    <text class="sn-demo__meta">imageMode="aspectFit"：整图完整显示，不裁切</text>

    <SnUpload
      :file-list="photos"
      :image-mode="'aspectFill'"
      custom-preview-class="sn-demo__tile"
      :limit="4"
      :auto-upload="false"
    />
    <text class="sn-demo__meta">imageMode="aspectFill"：铺满瓦片并裁切</text>

    <text class="sn-demo__meta"
      >customEvokeClass 改选择瓦片，customPreviewClass 改文件瓦片，customClass / customStyle
      改根节点</text
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
/* custom-class 落在 sn-upload 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__upload) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
/* custom-evoke-class / custom-preview-class 落在瓦片节点上。 */
.sn-demo :deep(.sn-demo__evoke) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo :deep(.sn-demo__tile) {
  border-radius: var(--sn-mp-radius-md);
  box-shadow: var(--sn-mp-shadow-xs);
}
</style>
