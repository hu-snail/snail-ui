<script setup lang="ts">
/**
 * Demo: sn-rate — CSS 类图标（cssIcon）。
 *
 * `css-icon="demo-star"` 把图标名当成裸 CSS 类名渲染（不加前缀），
 * `css-icon` 布尔形式则同时挂 `icon` 与 `active-icon` 两个类名。
 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const css = ref<number | null>(3);
const cssBool = ref<number | null>(2);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate v-model="css" css-icon="demo-star" :num="5" />
    <text class="sn-demo__meta">css-icon="demo-star"：类名原样挂在字形节点上</text>

    <SnRate v-model="cssBool" icon="demo-star-off" active-icon="demo-star" css-icon />
    <text class="sn-demo__meta">css-icon 布尔形式 + icon / active-icon：两个类名都挂上</text>
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
 * 占位 CSS 图标：真实项目里这些类来自图标子集 / 背景图。
 * 这里只用令牌画一个能看出差别的方块，证明 class 透传生效。
 */
.sn-demo :deep(.demo-star),
.sn-demo :deep(.demo-star-off) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid currentColor;
  border-radius: var(--sn-mp-radius-full);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.demo-star)::after {
  content: 'A';
}
.sn-demo :deep(.demo-star-off)::after {
  content: 'B';
}
</style>
