<script setup lang="ts">
/**
 * Demo: sn-progress (uni-end) — basic percentage + hideText.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-progress from its SFC source.
 */
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnProgress :percentage="0" />
    <SnProgress :percentage="30" />
    <SnProgress :percentage="68" />
    <SnProgress :percentage="100" />
    <SnProgress :percentage="45" hide-text />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
