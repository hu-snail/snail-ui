<script setup lang="ts">
/**
 * Demo: sn-progress (uni-end) — status colors and custom colors.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-progress from its SFC source.
 */
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnProgress :percentage="72" status="success" />
    <SnProgress :percentage="52" status="warning" />
    <SnProgress :percentage="28" status="danger" />
    <SnProgress :percentage="60" color="var(--sn-mp-color-feedback-info)" />
    <SnProgress
      :percentage="80"
      :color="['var(--sn-mp-color-action-primary)', 'var(--sn-mp-color-feedback-info)']"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
