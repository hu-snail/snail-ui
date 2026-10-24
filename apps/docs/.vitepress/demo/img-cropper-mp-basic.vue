<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — 打开裁剪层并读取 confirm 结果。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue'

const visible = ref(false)
const result = ref('—')

const imgSrc = 'https://picsum.photos/seed/snui-crop/1200/1200'

function onConfirm(payload: {
  scale: number
  rotate: number
  source: { x: number; y: number; width: number; height: number }
}) {
  result.value = `scale ${payload.scale.toFixed(2)} · rotate ${payload.rotate}° · ${payload.source.width}×${payload.source.height} @ (${payload.source.x}, ${payload.source.y})`
}

function onCancel() {
  result.value = '已取消'
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" type="primary" @tap="visible = true">打开裁剪</SnButton>
    <text class="sn-demo__meta">结果：{{ result }}</text>

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      aspect-ratio="1:1"
      custom-class="sn-demo-contained"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  word-break: break-all;
}
/* Docs-preview only: the cropper root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-img-cropper.sn-demo-contained {
  position: absolute;
}
</style>
