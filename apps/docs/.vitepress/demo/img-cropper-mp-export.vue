<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — img-width / img-height / max-scale / export-scale / quality / file-type。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue'

const visible = ref(false)
const result = ref('—')
const maxScale = ref(2)
const exportScale = ref(2)
const quality = ref(0.85)
const fileType = ref<'png' | 'jpg'>('png')

const imgSrc = '/demo/snui-crop-wide.jpg'

function open(next: 'png' | 'jpg') {
  fileType.value = next
  visible.value = true
}

function onConfirm(payload: {
  scale: number
  source: { x: number; y: number; width: number; height: number }
}) {
  const scaleOut = payload.scale * exportScale.value
  result.value = `源矩形 ${payload.source.width}×${payload.source.height} → 导出 ${Math.round(payload.source.width * scaleOut)}×${Math.round(payload.source.height * scaleOut)} · ${fileType.value} · quality ${quality.value}`
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnButton size="small" @tap="open('png')">按 PNG 裁剪</SnButton>
      <SnButton size="small" @tap="open('jpg')">按 JPG 裁剪</SnButton>
    </view>

    <view class="sn-demo__row">
      <SnButton size="small" @tap="maxScale = 2">max-scale = 2</SnButton>
      <SnButton size="small" @tap="maxScale = 6">max-scale = 6</SnButton>
      <SnButton size="small" @tap="exportScale = exportScale === 2 ? 3 : 2">
        export-scale = {{ exportScale }}
      </SnButton>
      <SnButton size="small" @tap="quality = quality === 0.85 ? 0.5 : 0.85">
        quality = {{ quality }}
      </SnButton>
    </view>

    <text class="sn-demo__meta">结果：{{ result }}</text>

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      :img-width="200"
      :img-height="160"
      :max-scale="maxScale"
      :export-scale="exportScale"
      :quality="quality"
      :file-type="fileType"
      aspect-ratio="4:3"
      custom-class="sn-demo-contained"
      @confirm="onConfirm"
      @cancel="result = '已取消'"
    />

    <text class="sn-demo__meta">
      img-width / img-height 以设计稿 px 给出（内部 ×2 换 rpx）作为预览框尺寸；max-scale 限制双指缩放上限（最小 0.5）。
      export-scale / quality / file-type 只对齐参考 API：本组件不做栅格化，宿主按 confirm 报回的几何自行导出，
      这里把三者代入演示。
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
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
