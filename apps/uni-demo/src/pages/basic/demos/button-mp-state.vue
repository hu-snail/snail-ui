<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — disabled 状态（语义色 + 变体形态）。
 * 加载状态统一收敛到「加载」模块。
 *
 * 布局说明：uni-app x 不支持 flex `gap`，间距用内联 `custom-style` margin
 * 兜底，显式 `flex-direction: row` 抵消 uni-app x 的 column 默认值。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 行内按钮间距（uni-app x 无 gap 兜底）。 */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">禁用（disabled × 语义色）</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" disabled>默认按钮</SnButton>
      <SnButton :custom-style="rowGap" disabled type="primary">主要按钮</SnButton>
      <SnButton :custom-style="rowGap" disabled type="success">成功按钮</SnButton>
      <SnButton :custom-style="rowGap" disabled type="info">信息按钮</SnButton>
      <SnButton :custom-style="rowGap" disabled type="warning">警告按钮</SnButton>
      <SnButton :custom-style="rowGap" disabled type="danger">危险按钮</SnButton>
    </view>

    <text class="sn-mp-btn-label">禁用（disabled × 变体：朴素 / 柔和 / 虚线 / 细边框）</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" disabled variant="plain" type="primary">朴素禁用</SnButton>
      <SnButton :custom-style="rowGap" disabled variant="soft" type="primary">柔和禁用</SnButton>
      <SnButton :custom-style="rowGap" disabled variant="dashed" type="primary">虚线禁用</SnButton>
      <SnButton :custom-style="rowGap" disabled>细边框禁用</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
