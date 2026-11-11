<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — 预览框尺寸（imgWidth / imgHeight）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue';

const visible = ref(false);
const result = ref('—');

const imgSrc = '/demo/snui-crop-wide.jpg';

function onConfirm(payload: {
  scale: number;
  source: { x: number; y: number; width: number; height: number };
}) {
  result.value = `源矩形 ${payload.source.width}×${payload.source.height}（×${payload.scale}）`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" @tap="visible = true">打开裁剪（200×160 预览框）</SnButton>

    <text class="sn-demo__meta">结果：{{ result }}</text>

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      :img-width="200"
      :img-height="160"
      aspect-ratio="4:3"
      custom-class="sn-demo-contained"
      @confirm="onConfirm"
      @cancel="result = '已取消'"
    />

    <text class="sn-demo__meta">
      img-width / img-height 以设计稿 px 给出（内部 ×2 换 rpx），决定预览框尺寸。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
  word-break: break-all;
}
/* Docs-preview only: the cropper root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-img-cropper.sn-demo-contained {
  position: absolute;
}
</style>
