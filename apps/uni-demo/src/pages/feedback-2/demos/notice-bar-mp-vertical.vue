<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — vertical one-line-at-a-time rotation.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import { ref } from 'vue';
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue';

const lines = [
  '第一条公告：本周五有线下分享会',
  '第二条公告：新版 App 已上线',
  '第三条公告：客服电话变更为 400-000-0000',
];
const activeIndex = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar type="info" :text="lines" direction="vertical" @next="activeIndex = $event" />
    <text class="sn-notice-bar-demo__meta"
      >当前第 {{ activeIndex + 1 }} / {{ lines.length }} 条</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-notice-bar-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
