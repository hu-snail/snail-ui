<script setup lang="ts">
/** Demo: sn-signature — undo step: `step` undoes 2 strokes per tap (needs `enableHistory`). */
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
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
