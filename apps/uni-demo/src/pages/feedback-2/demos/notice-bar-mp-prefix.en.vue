<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — English shadow of notice-bar-mp-prefix.
 */
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Bell } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue';

registerSnIcons({ Bell });
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar
      type="info"
      prefix="Bell"
      text="prefix swaps in the Bell glyph from the registry, replacing the type glyph."
    />

    <text class="sn-demo__meta">
      A prefix that misses the registry falls back to the type glyph.
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
</style>
