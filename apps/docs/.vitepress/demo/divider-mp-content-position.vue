<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — content-position 三档。
 *
 * `contentPosition` 只在水平方向且有文字时生效：线的宽度始终撑满，
 * 位置变化的是文字，文字背景色把线遮出一段空隙。
 */
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__case">
      <SnDivider content-position="left">左侧 left</SnDivider>
      <SnDivider content-position="center">居中 center（默认）</SnDivider>
      <SnDivider content-position="right">右侧 right</SnDivider>
    </view>

    <view class="sn-demo__case">
      <SnDivider content-position="left" margin-size="small">small 边距 + left</SnDivider>
      <SnDivider content-position="right" margin-size="small" dashed>dashed + right</SnDivider>
    </view>
    <text class="sn-demo__meta">contentPosition 与 dashed / marginSize 互不干扰，可叠加使用。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__case {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
