<script setup lang="ts">
/**
 * Demo: sn-gap (uni-end) — rpx string height plus custom-class / custom-style.
 *
 * A numeric `height` is px; a string is forwarded verbatim, so an rpx rhythm
 * does not drift with the device width. custom-class / custom-style land on the
 * root and are handy for a visible background that proves the gap occupies
 * space.
 */
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">Content above</view>
    <SnGap height="24rpx" custom-class="sn-demo__gap" />
    <view class="sn-demo__block">height="24rpx" (a string is forwarded verbatim)</view>

    <SnGap :height="40" custom-class="sn-demo__gap" custom-style="opacity: 0.5;" />
    <view class="sn-demo__block">height=40 (a number is px) + custom-style</view>

    <SnGap
      height="48rpx"
      bg-color="var(--sn-mp-color-action-primary-soft)"
      custom-class="sn-demo__gap sn-demo__gap--wide"
    />
    <view class="sn-demo__block">custom-class adds a class name and stacks with bg-color</view>
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
/* custom-class lands on the sn-gap root, so it needs :deep. */
.sn-demo :deep(.sn-demo__gap) {
  border-radius: var(--sn-mp-radius-xs);
}
.sn-demo :deep(.sn-demo__gap--wide) {
  width: 100%;
}
</style>
