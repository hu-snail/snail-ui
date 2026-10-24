<script setup lang="ts">
/**
 * Demo: sn-loadmore (uni-end) — loading-props / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loadmore from its SFC source.
 */
import SnLoadmore from '@snui/uni-src/components/sn-loadmore/sn-loadmore.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLoadmore
      state="loading"
      loading-text="loading-props swaps the spinner shape"
      :loading-props="{ type: 'wave' }"
    />

    <SnLoadmore
      state="loading"
      loading-text="loading-props changes shape and color"
      :loading-props="{ type: 'dots', color: 'var(--sn-mp-color-feedback-success)' }"
    />

    <SnLoadmore
      state="finished"
      finished-text="custom-class appends a root class"
      custom-class="sn-demo__loadmore"
    />

    <SnLoadmore
      state="error"
      error-text="custom-style layers an inline style"
      custom-class="sn-demo__loadmore"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    />

    <text class="sn-demo__meta">
      loading-props is forwarded straight to the inner sn-loading, so type / color / size all
      work; custom-class / custom-style land on the root node.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-loadmore root node. */
.sn-demo :deep(.sn-demo__loadmore) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
