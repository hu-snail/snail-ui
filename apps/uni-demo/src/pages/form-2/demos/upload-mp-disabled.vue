<script setup lang="ts">
/** Demo: sn-upload — 禁用：disabled 锁掉选择与删除，仅展示列表。 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const done = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/a/200',
    name: 'a.png',
    status: 'success',
    percent: 100,
  },
  { uid: 2, url: 'https://picsum.photos/seed/b/200', name: 'b.png', status: 'fail' },
]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnUpload :file-list="done" disabled :limit="3" />
    <text class="sn-demo__meta">disabled：选择瓦片与删除按钮都被锁掉</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
