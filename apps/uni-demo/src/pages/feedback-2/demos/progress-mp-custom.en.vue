<script setup lang="ts">
/**
 * Demo: sn-progress (uni-end) — custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-progress from its SFC source.
 */
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnProgress :percentage="40" custom-class="sn-demo__progress" />

    <SnProgress :percentage="70" custom-style="padding: var(--sn-mp-spacing-2);" />

    <SnProgress
      :percentage="55"
      status="success"
      custom-class="sn-demo__progress"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    />

    <text class="sn-demo__meta">
      custom-class appends a root class (a dashed outline here) and custom-style writes an inline
      style on the root; the two can be combined.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-progress root node. */
.sn-demo :deep(.sn-demo__progress) {
  padding: var(--sn-mp-spacing-2);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
