<script setup lang="ts">
/** Demo: sn-upload — `disabled` locks picking and removal; `accept` switches the picker (image / video / file); list entries render progress and the failure state from `status`. */
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
const videoFiles = ref<UploadFileItem[]>([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnUpload :file-list="done" disabled :limit="3" />
    <SnUpload v-model:file-list="videoFiles" accept="video" :limit="1" :show-limit-num="true" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
