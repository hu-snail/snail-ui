<script setup lang="ts">
/**
 * Demo: sn-loading (uni-end) — text, direction, size and color.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loading from its SFC source.
 */
import SnLoading from '@snui/uni-src/components/sn-loading/sn-loading.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLoading text="Loading" />
    <SnLoading type="dots" direction="horizontal" text="Submitting…" />
    <SnLoading type="wave" :size="80" text="size = 80" />
    <SnLoading type="spinner" color="var(--sn-mp-color-feedback-success)" text="Custom color" />
    <SnLoading type="circular" direction="horizontal">
      <text class="sn-loading-demo__slot">Default slot label</text>
    </SnLoading>
  </view>
</template>

<style scoped>
.sn-loading-demo__slot {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
