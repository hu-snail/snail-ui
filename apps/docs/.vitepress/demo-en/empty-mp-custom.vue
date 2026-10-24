<script setup lang="ts">
/**
 * Demo: sn-empty (uni-end) — custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-empty from its SFC source.
 */
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnEmpty tip="custom-class appends a root class" custom-class="sn-demo__empty" />

    <SnEmpty
      tip="custom-style writes an inline style on the root"
      custom-style="padding: var(--sn-mp-spacing-6); border-radius: var(--sn-mp-radius-lg);"
    />

    <SnEmpty
      tip="Combined: the class owns the outline, the inline style owns the padding"
      custom-class="sn-demo__empty"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
/* custom-class lands on the sn-empty root node. */
.sn-demo :deep(.sn-demo__empty) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
