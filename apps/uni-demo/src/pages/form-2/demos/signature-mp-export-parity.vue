<script setup lang="ts">
/**
 * Demo: sn-signature — 导出与压感参数。
 * fileType / quality / exportScale / pressure / maxWidth / minWidth / minSpeed 为与
 * wd-signature 对齐而声明；本构建不做栅格化，导出由宿主在 confirm 回调里完成，
 * 压感模拟（speed → width）未实现，因此这些参数不会改变画板行为。
 */
import { ref } from 'vue';
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';

const strokes = ref(0);
const onConfirm = (result: { paths: unknown[] }) => {
  strokes.value = result.paths.length;
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">fileType / quality / exportScale（宿主导出时使用）</text>
    <SnSignature
      file-type="png"
      :quality="0.92"
      :export-scale="2"
      confirm-text="导出 PNG"
      @confirm="onConfirm"
    />
    <text class="sn-demo__meta">笔画数：{{ strokes }}</text>

    <text class="sn-demo__title">pressure / maxWidth / minWidth / minSpeed（压感模拟未实现）</text>
    <SnSignature
      :pressure="true"
      :max-width="8"
      :min-width="2"
      :min-speed="0.5"
      :line-width="3"
      custom-class="sn-demo__pad"
      custom-style="border-radius: var(--sn-mp-radius-lg);"
      @confirm="onConfirm"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__pad {
  border: 1rpx solid var(--sn-mp-color-border-default);
}
</style>
