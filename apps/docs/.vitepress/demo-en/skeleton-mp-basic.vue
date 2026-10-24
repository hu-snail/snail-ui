<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — the four theme presets.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-skeleton from its SFC source.
 */
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSkeleton theme="text" />
    <SnSkeleton theme="avatar" />
    <SnSkeleton theme="paragraph" />
    <SnSkeleton theme="image" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
