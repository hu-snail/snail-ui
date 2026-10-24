<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — content-position, three steps.
 *
 * `contentPosition` only applies to the horizontal axis with slot text: the
 * line always spans the full width, the text is what moves, and its background
 * punches the visible gap in the line.
 */
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__case">
      <SnDivider content-position="left">Left</SnDivider>
      <SnDivider content-position="center">Center (default)</SnDivider>
      <SnDivider content-position="right">Right</SnDivider>
    </view>

    <view class="sn-demo__case">
      <SnDivider content-position="left" margin-size="small">small margin + left</SnDivider>
      <SnDivider content-position="right" margin-size="small" dashed>dashed + right</SnDivider>
    </view>
    <text class="sn-demo__meta">contentPosition is independent of dashed / marginSize and stacks with them.</text>
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
