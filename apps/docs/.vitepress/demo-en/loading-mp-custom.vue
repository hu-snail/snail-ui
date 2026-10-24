<script setup lang="ts">
/**
 * Demo: sn-loading (uni-end) — inherit-color / custom-class / custom-style /
 * custom-spinner-class.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loading from its SFC source.
 */
import SnLoading from '@snui/uni-src/components/sn-loading/sn-loading.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__inherit">
      <SnLoading inherit-color type="circular" text="inherit-color: inherits the parent text color" />
    </view>

    <SnLoading
      type="spinner"
      text="custom-class + custom-style"
      custom-class="sn-demo__block"
      custom-style="padding: var(--sn-mp-spacing-4);"
    />

    <SnLoading
      type="dots"
      text="custom-spinner-class only targets the spinner box"
      custom-spinner-class="sn-demo__spinner"
    />

    <text class="sn-demo__meta">
      custom-class / custom-style land on the root node; custom-spinner-class only lands on
      the spinner box in the middle, so the spinner can be scaled without touching the text.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* inherit-color reads the parent color — set it to the brand color here. */
.sn-demo__inherit {
  color: var(--sn-mp-color-feedback-success);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-loading root node. */
.sn-demo :deep(.sn-demo__block) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
/* custom-spinner-class lands on the spinner box. */
.sn-demo :deep(.sn-demo__spinner) {
  transform: scale(1.4);
}
</style>
