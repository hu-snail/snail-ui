<script setup lang="ts">
/** Demo: sn-upload — sn-upload 基础上传：v-model:file-list 持有列表，limit 限数量，maxSize 限体积（超出触发 oversize）。 */
import { ref } from 'vue'
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue'
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types'

const files = ref<UploadFileItem[]>([])
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
    <text class="sn-demo__meta">已选 {{ files.length }} 个文件</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
