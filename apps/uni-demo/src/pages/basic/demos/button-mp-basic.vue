<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — basic types.
 *
 * 布局说明：uni-app x 不支持 flex `gap`（README 真机清单），行内间距统一用
 * SnButton 的内联 `custom-style` margin 兜底，显式 `flex-direction: row`
 * 抵消 uni-app x 的 column 默认值。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 行内按钮间距（uni-app x 无 gap 兜底）。 */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap">默认按钮</SnButton>
      <SnButton :custom-style="rowGap" type="primary">主要按钮</SnButton>
      <SnButton :custom-style="rowGap" type="success">成功按钮</SnButton>
      <SnButton :custom-style="rowGap" type="info">信息按钮</SnButton>
      <SnButton :custom-style="rowGap" type="warning">警告按钮</SnButton>
      <SnButton :custom-style="rowGap" type="danger">危险按钮</SnButton>
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
</style>
