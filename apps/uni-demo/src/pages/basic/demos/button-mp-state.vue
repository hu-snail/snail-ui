<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — disabled 状态（语义色 + 变体形态）。
 * 加载状态统一收敛到「加载」模块。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">禁用（disabled × 语义色）</text>
    <view class="sn-demo__row">
      <SnButton disabled>默认按钮</SnButton>
      <SnButton disabled type="primary">主要按钮</SnButton>
      <SnButton disabled type="success">成功按钮</SnButton>
      <SnButton disabled type="info">信息按钮</SnButton>
      <SnButton disabled type="warning">警告按钮</SnButton>
      <SnButton disabled type="danger">危险按钮</SnButton>
    </view>

    <text class="sn-demo__label">禁用（disabled × 变体：朴素 / 柔和 / 虚线 / 细边框）</text>
    <view class="sn-demo__row">
      <SnButton disabled variant="plain" type="primary">朴素禁用</SnButton>
      <SnButton disabled variant="soft" type="primary">柔和禁用</SnButton>
      <SnButton disabled variant="dashed" type="primary">虚线禁用</SnButton>
      <SnButton disabled>细边框禁用</SnButton>
    </view>
  </view>
</template>

<style scoped>
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
