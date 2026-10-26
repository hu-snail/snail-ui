<script setup lang="ts">
/**
 * Demo: sn-slide-verify — icon / successIcon / iconPrefix / cssIcon / iconSize / successIconSize。
 *
 * 不给 `icon` / `success-icon` 时用内置 SVG 字形；给了名字就走 iconfont 约定
 * （`icon-prefix` + `-` + 名字），`css-icon` 则把名字当裸类名。`icon-size` /
 * `success-icon-size` 单独控制两个字形盒子的尺寸（数字按 rpx）。
 */
import { ref } from 'vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

const state = ref('待验证');
const onSuccess = (): void => {
  state.value = '已通过';
};
const onFail = (): void => {
  state.value = '未通过';
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSlideVerify
      icon="demo-next"
      success-icon="demo-done"
      icon-prefix="sn-icon"
      :icon-size="40"
      :success-icon-size="36"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta"
      >icon / successIcon 走 iconfont 约定（sn-icon-demo-next），尺寸各自独立</text
    >

    <SnSlideVerify css-icon="demo-verify-css" :icon-size="32" @success="onSuccess" @fail="onFail" />
    <text class="sn-demo__meta">cssIcon 传字符串：类名原样渲染，不加 iconPrefix 前缀</text>

    <SnSlideVerify
      :tolerance="24"
      custom-class="sn-demo__verify"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta"
      >tolerance=24 放宽右边缘容差；customClass / customStyle 落在根节点上</text
    >

    <text class="sn-demo__meta">状态：{{ state }}</text>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/*
 * 占位 iconfont 字形：真实项目里这些类来自图标字体。
 * 这里用令牌画一个可辨识的方块，证明类名透传生效。
 */
.sn-demo :deep(.sn-icon-demo-next),
.sn-demo :deep(.sn-icon-demo-done),
.sn-demo :deep(.demo-verify-css) {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.sn-icon-demo-next)::after {
  content: 'N';
}
.sn-demo :deep(.sn-icon-demo-done)::after {
  content: 'D';
}
.sn-demo :deep(.demo-verify-css)::after {
  content: 'C';
}
/* custom-class 落在 sn-slide-verify 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__verify) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
