<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — css-icon 传字符串 class。
 *
 * `css-icon="my-class"` 直接把该 class 原样挂在字形节点上（不加 classPrefix
 * 前缀），适合已有自己命名的 CSS 图标（背景图 / 伪元素 / 字体子集）。
 * 文档站没有图标资源，所以下面的类用 demo 自带 CSS 画出占位图形。
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnIcon css-icon="demo-icon-cart" :size="40" />
      <SnIcon css-icon="demo-icon-bell" :size="40" />
      <SnIcon css-icon="demo-icon-check" :size="40" />
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-icon-cart" / "demo-icon-bell" / "demo-icon-check" —— class 原样渲染，不追加前缀
    </text>

    <view class="sn-demo__row">
      <SnIcon name="search" css-icon :size="40" />
    </view>
    <text class="sn-demo__meta">
      css-icon 布尔形式 + name：同时挂 sn-icon-search 与 search 两个类，兼容两种命名约定
    </text>
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

/*
 * 占位 CSS 图标。真实项目里这些类来自图标子集 / 背景图 / 字体；
 * 这里只用令牌画一个能看出差别的方块，证明 class 透传生效。
 */
.sn-demo :deep(.demo-icon-cart),
.sn-demo :deep(.demo-icon-bell),
.sn-demo :deep(.demo-icon-check) {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo :deep(.demo-icon-cart)::after { content: 'C'; }
.sn-demo :deep(.demo-icon-bell)::after { content: 'B'; }
.sn-demo :deep(.demo-icon-check)::after { content: 'V'; }
.sn-demo :deep(.search)::after { content: 'S'; }
.sn-demo :deep(.search) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
