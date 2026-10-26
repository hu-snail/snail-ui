<script setup lang="ts">
/**
 * Demo: sn-upload — multiple / sourceType / sizeType / accept / limit / showLimitNum。
 *
 * `multiple` 让选择器一次可选多个；`source-type` 限定来源（相册 / 相机）；
 * `size-type` 限定原图 / 压缩；`accept` 决定走哪个选择器 API；`limit` +
 * `show-limit-num` 一起渲染「当前 / 上限」计数并在满额时收起选择瓦片。
 *
 * 文档预览里没有 uni 运行时，点选择瓦片只会发出 `chooseerror`；
 * 下面的用例重点是参数组合与满额后的形态。
 */
import { ref } from 'vue';
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue';
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types';

/** 相册多选、最多 6 张：选择器一次可带回多张。 */
const album = ref<UploadFileItem[]>([
  {
    uid: 1,
    url: 'https://picsum.photos/seed/multi-a/200',
    name: 'a.png',
    status: 'success',
    percent: 100,
  },
]);

/** 只允许相机、原图：sourceType / sizeType 都收窄。 */
const camera = ref<UploadFileItem[]>([]);

/** 文件选择器（accept="file"）+ 满额：已到 limit 后不再渲染选择瓦片。 */
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
    <text class="sn-demo__meta">multiple 一次多选；limit=6 满额后选择瓦片消失，计数停在 6/6</text>

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
    <text class="sn-demo__meta">sourceType 收窄到相机、sizeType 只取原图</text>

    <text class="sn-demo__title">accept="file" + 已满额</text>
    <SnUpload
      v-model:file-list="files"
      action="/api/upload"
      accept="file"
      :limit="2"
      :auto-upload="false"
      @chooseerror="lastError = String($event)"
    />
    <text class="sn-demo__meta">accept="file" 走文件选择器；2/2 已满，只保留删除按钮</text>

    <text class="sn-demo__meta">chooseerror 载荷：{{ lastError }}</text>
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
