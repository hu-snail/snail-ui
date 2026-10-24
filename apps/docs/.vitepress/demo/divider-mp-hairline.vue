<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — `hairline` 细线开关。
 *
 * `hairline` 默认 true：水平线 `border-top-width: 1rpx`、垂直线
 * `border-left-width: 1rpx`。置 false 回到 `2rpx` 常规线宽。
 *
 * 1rpx 在 750 设计稿下是 0.5px，正好是移动端「一像素细线」的标准做法 ——
 * 高 DPI 屏上不会出现 2px 的粗边。
 */
import { ref } from 'vue'
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue'

const hairline = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <text class="sn-demo__word">hairline = {{ hairline }}</text>
      <view class="sn-demo__switch" @tap="hairline = !hairline">
        <text class="sn-demo__switch-label">切换</text>
      </view>
    </view>

    <text class="sn-demo__meta">水平线：hairline（1rpx）与常规（2rpx）并排对比</text>
    <SnDivider :hairline="hairline" />
    <SnDivider :hairline="!hairline" />

    <text class="sn-demo__meta">带文字的水平线同样受 hairline 影响</text>
    <SnDivider :hairline="hairline">hairline</SnDivider>
    <SnDivider :hairline="!hairline">常规线宽</SnDivider>

    <text class="sn-demo__meta">垂直线：hairline 改的是 border-left-width</text>
    <view class="sn-demo__row">
      <text class="sn-demo__word">编辑</text>
      <SnDivider vertical :hairline="hairline" />
      <text class="sn-demo__word">复制</text>
      <SnDivider vertical :hairline="!hairline" />
      <text class="sn-demo__word">删除</text>
    </view>

    <text class="sn-demo__meta">hairline 与 dashed 可以叠加：细虚线</text>
    <SnDivider :hairline="hairline" dashed />
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
.sn-demo__word {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__switch {
  display: inline-flex;
  align-items: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__switch-label {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
