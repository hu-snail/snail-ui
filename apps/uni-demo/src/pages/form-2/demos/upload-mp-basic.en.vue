<script setup lang="ts">
/** Demo: sn-upload — Basic upload: `v-model:file-list` holds the list, `limit` caps the count and `maxSize` caps the bytes (oversize fires otherwise). */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

const files = ref<UploadFileItem[]>([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      :limit="3"
      :max-size="5242880"
      :auto-upload="false"
    />
    <text class="sn-demo__meta">{{ files.length }} file(s) selected</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
