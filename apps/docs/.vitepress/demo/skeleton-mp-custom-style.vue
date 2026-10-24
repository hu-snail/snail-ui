<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-skeleton from its SFC source.
 */
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSkeleton theme="paragraph" custom-class="sn-demo__skeleton" />

    <SnSkeleton
      theme="avatar"
      custom-style="padding: var(--sn-mp-spacing-3); border-radius: var(--sn-mp-radius-md);"
    />

    <SnSkeleton
      theme="image"
      custom-class="sn-demo__skeleton"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    />

    <text class="sn-demo__meta">
      custom-class 追加根节点类名（可传字符串 / 字符串数组 / 布尔映射对象），
      custom-style 写根节点内联样式。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-skeleton 根节点上。 */
.sn-demo :deep(.sn-demo__skeleton) {
  padding: var(--sn-mp-spacing-3);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
