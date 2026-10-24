<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — marquee, static and wrapable modes.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar text="Scheduled maintenance tonight at 23:00, expected to take 30 minutes." />

    <SnNoticeBar
      text="With scrollable=false the text is static and clipped past the edge."
      :scrollable="false"
    />

    <SnNoticeBar
      text="wrapable=true together with scrollable=false wraps long announcements onto multiple lines."
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
