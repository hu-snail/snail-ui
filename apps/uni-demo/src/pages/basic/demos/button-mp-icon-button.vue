<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — 图标按钮，集成 sn-icon 内置图标。
 *
 * `icon-name` 字符串由内嵌 sn-icon 解析（registry → 内置目录 lucide 图形 →
 * Provider），SVG 直接渲染，无需字体文件。图标大小默认随按钮尺寸自动适配
 * （small 28 / medium 32 / large 40），`icon-size` 可显式覆盖。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">常用操作（图标大小自动适配按钮尺寸）</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check">确认</SnButton>
      <SnButton type="danger" icon-name="trash-2">删除</SnButton>
      <SnButton type="info" icon-name="arrow-right">前进</SnButton>
    </view>

    <text class="sn-demo__label">纯图标（无文字）</text>
    <view class="sn-demo__row">
      <SnButton icon-name="settings" />
      <SnButton type="primary" icon-name="search" />
      <SnButton type="success" icon-name="plus" />
      <SnButton type="warning" icon-name="heart" />
    </view>

    <text class="sn-demo__label">圆形图标按钮（circle）</text>
    <view class="sn-demo__row">
      <SnButton circle icon-name="settings" />
      <SnButton circle type="primary" icon-name="search" />
      <SnButton circle type="success" icon-name="plus" />
      <SnButton circle type="danger" icon-name="trash-2" />
      <SnButton circle size="small" type="info" icon-name="arrow-right" />
      <SnButton circle size="large" type="warning" icon-name="heart" />
    </view>

    <text class="sn-demo__label">图标 + 加载态</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="download">下载</SnButton>
      <SnButton type="primary" loading>下载中</SnButton>
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
