<script setup lang="ts">
/** Demo: sn-gap (uni-end) — 默认高度 / 自定义高度 / 背景色。 */
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-block">上方内容</view>
    <SnGap />
    <view class="sn-demo-block">默认 14px 间隔</view>
    <SnGap :height="24" />
    <view class="sn-demo-block">24px 间隔</view>
    <SnGap height="20px" bg-color="var(--sn-mp-color-background-subtle)" />
    <view class="sn-demo-block">带背景色的间隔</view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.sn-demo-block {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  font-size: 13px;
}
</style>
