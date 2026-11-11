<script setup lang="ts">
/** Demo: sn-upload — picker type: `accept` switches the picker (image / video / file). */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const videoFiles = ref<UploadFileItem[]>([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnUpload v-model:file-list="videoFiles" accept="video" :limit="1" />
    <text class="sn-demo__meta">accept="video": the picker targets videos (image / video / file)</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
