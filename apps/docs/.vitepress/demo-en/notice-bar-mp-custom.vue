<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — color / background-color / custom-class /
 * custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar
      type="info"
      text="color / background-color override the default tint"
      color="var(--sn-mp-color-text-primary)"
      background-color="var(--sn-mp-color-action-primary-soft)"
    />

    <SnNoticeBar
      type="warning"
      text="custom-class adds a class to the root node (bold border)"
      custom-class="sn-demo__bar"
    />

    <SnNoticeBar
      type="danger"
      text="custom-style lands on the root node and stacks with custom-class"
      custom-class="sn-demo__bar"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    />

    <text class="sn-demo__meta">
      All three land on the root node: color / backgroundColor go through inline styles and
      custom-class appends a class name.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-notice-bar root node — needs :deep to cross the boundary. */
.sn-demo :deep(.sn-demo__bar) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
