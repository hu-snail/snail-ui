<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — color / background-color / custom-class /
 * custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar
      type="info"
      text="color / background-color 覆盖默认色调"
      color="var(--sn-mp-color-text-primary)"
      background-color="var(--sn-mp-color-action-primary-soft)"
    />

    <SnNoticeBar
      type="warning"
      text="custom-class 追加根节点类名（加粗边框）"
      custom-class="sn-demo__bar"
    />

    <SnNoticeBar
      type="danger"
      text="custom-style 写在根节点上，可与 custom-class 叠加"
      custom-class="sn-demo__bar"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    />

    <text class="sn-demo__meta">
      三个 prop 都落在根节点：color / backgroundColor 走内联样式，custom-class 追加类名。
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
/* custom-class 落在 sn-notice-bar 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__bar) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
