<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — 缩放上限（maxScale）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue';

const visible = ref(false);
const maxScale = ref(2);
const result = ref('—');

const imgSrc = '/demo/snui-crop-wide.jpg';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnButton size="small" @tap="visible = true">打开裁剪</SnButton>
      <SnButton size="small" @tap="maxScale = 2">max-scale = 2</SnButton>
      <SnButton size="small" @tap="maxScale = 6">max-scale = 6</SnButton>
    </view>

    <text class="sn-demo__meta">结果：{{ result }}</text>

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      :max-scale="maxScale"
      custom-class="sn-demo-contained"
      @confirm="result = `缩放上限 ${maxScale} 已生效`"
      @cancel="result = '已取消'"
    />

    <text class="sn-demo__meta">
      max-scale 限制双指缩放上限（最小 0.5）：切到 6 后双指能放得更大，切回 2 立刻收紧。
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
