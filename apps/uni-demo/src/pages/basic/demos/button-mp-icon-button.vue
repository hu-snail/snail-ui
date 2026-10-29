<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 图标按钮，集成 sn-icon 内置图标。
 *
 * `icon-name` 字符串由内嵌 sn-icon 解析（registry → 内置目录 lucide 图形 →
 * Provider），SVG 直接渲染，无需字体文件。`icon-size` 控制图标大小（rpx）。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">常用操作</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check" :icon-size="36">确认</SnButton>
      <SnButton type="danger" icon-name="trash-2" :icon-size="32">删除</SnButton>
      <SnButton type="info" icon-name="arrow-right" :icon-size="36">前进</SnButton>
    </view>

    <text class="sn-demo__label">纯图标（无文字）</text>
    <view class="sn-demo__row">
      <SnButton icon-name="settings" :icon-size="40" />
      <SnButton type="primary" icon-name="search" :icon-size="40" />
      <SnButton type="success" icon-name="plus" :icon-size="40" />
      <SnButton type="warning" icon-name="heart" :icon-size="40" />
    </view>

    <text class="sn-demo__label">图标 + 加载态</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="download" :icon-size="36">下载</SnButton>
      <SnButton type="primary" loading :icon-size="36" loading-size="36">下载中</SnButton>
    </view>
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
  gap: 16rpx;
  align-items: center;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
