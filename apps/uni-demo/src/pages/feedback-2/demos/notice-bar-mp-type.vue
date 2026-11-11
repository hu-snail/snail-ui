<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — warning / info / danger tints.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar type="warning" text="warning：默认类型，橙色底" />
    <SnNoticeBar type="info" text="info：中性信息，灰色底" />
    <SnNoticeBar type="danger" text="danger：危险提示，红色底" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
