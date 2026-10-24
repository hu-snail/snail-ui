<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — marquee, static and wrapable modes.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar text="系统将于今晚 23:00 进行维护，预计耗时 30 分钟。" />

    <SnNoticeBar
      text="scrollable=false 时静态展示，超出宽度会截断。"
      :scrollable="false"
    />

    <SnNoticeBar
      text="wrapable=true 且 scrollable=false 时自动换行，适合较长的公告文案展示。"
      :scrollable="false"
      wrapable
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
