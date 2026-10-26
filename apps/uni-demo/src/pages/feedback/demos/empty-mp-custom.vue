<script setup lang="ts">
/**
 * Demo: sn-empty (uni-end) — custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-empty from its SFC source.
 */
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnEmpty tip="custom-class 追加根节点类名" custom-class="sn-demo__empty" />

    <SnEmpty
      tip="custom-style 写根节点内联样式"
      custom-style="padding: var(--sn-mp-spacing-6); border-radius: var(--sn-mp-radius-lg);"
    />

    <SnEmpty
      tip="两者叠加：类名负责外框，内联样式负责内边距"
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
/* custom-class 落在 sn-empty 根节点上。 */
.sn-demo :deep(.sn-demo__empty) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
