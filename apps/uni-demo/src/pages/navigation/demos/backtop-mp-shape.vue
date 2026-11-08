<script setup lang="ts">
/** Demo: sn-backtop — 圆形 / 方形 × 尺寸 × 内容形态。 */
import { ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

/** 常显：直接越过默认阈值 300。 */
const scrollTop = ref(500);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__stage">
      <SnBacktop
        :scroll-top="scrollTop"
        size="small"
        :bottom="104"
        :right="16"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        text="顶部"
        :bottom="104"
        :right="72"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        shape="square"
        size="small"
        :bottom="24"
        :right="16"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        shape="square"
        size="large"
        text="回到顶部"
        :bottom="24"
        :right="72"
        custom-class="sn-demo-pinned"
      />
    </view>
    <text class="sn-demo__meta">
      上排圆形、下排方形；左侧小档纯图标，右侧图标 + 文字（宽度随内容自适应，长文案自动省略）。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__stage {
  position: relative;
  height: 440rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
  overflow: hidden;
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed buttons inside the stage. */
.sn-demo__stage :deep(.sn-backtop.sn-demo-pinned) {
  position: absolute;
}
</style>
