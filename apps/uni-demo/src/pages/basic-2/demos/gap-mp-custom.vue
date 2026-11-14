<script setup lang="ts">
/**
 * Demo: sn-gap (uni-end) — rpx 字符串高度 + custom-class / custom-style。
 *
 * `height` 传数字按 px，传字符串则原样转发 —— 移动端节奏用 rpx 时不会
 * 因为设备宽度不同而错位。custom-class / custom-style 落在根节点，
 * 用来加内联的可见背景，便于确认间隔真的占位。
 */
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">上方内容</view>
    <SnGap height="24rpx" custom-class="sn-demo__gap" />
    <view class="sn-demo__block">height="24rpx"（字符串原样转发）</view>

    <SnGap :height="40" custom-class="sn-demo__gap" custom-style="opacity: 0.5;" />
    <view class="sn-demo__block">height=40（数字按 px）+ custom-style</view>

    <SnGap
      height="48rpx"
      bg-color="var(--sn-mp-color-action-primary-soft)"
      custom-class="sn-demo__gap sn-demo__gap--wide"
    />
    <view class="sn-demo__block">custom-class 追加类名，可与 bg-color 叠加</view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}
.sn-demo__block {
  display: flex;
  align-items: center;
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xs);
}
/* custom-class 落在 sn-gap 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__gap) {
  border-radius: var(--sn-mp-radius-xs);
}
.sn-demo :deep(.sn-demo__gap--wide) {
  width: 100%;
}
</style>
