<script setup lang="ts">
/** Demo: sn-signature — pad look and scrolling: height / width / backgroundColor / disableScroll / step. */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">height (a number is an rpx design value)</text>
    <SnSignature :height="320" />

    <text class="sn-demo__title">width + backgroundColor (overrides the pad background token)</text>
    <SnSignature
      width="100%"
      :height="280"
      background-color="var(--sn-mp-color-background-soft)"
    />

    <text class="sn-demo__title">disableScroll=false (the page still scrolls while drawing)</text>
    <SnSignature :disable-scroll="false" :height="260" />

    <text class="sn-demo__title">step (undo 2 strokes per tap; needs enableHistory)</text>
    <SnSignature enable-history :step="2" :height="260" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
