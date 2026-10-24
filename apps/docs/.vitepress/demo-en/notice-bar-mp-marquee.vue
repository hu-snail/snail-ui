<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — prefix / delay / speed.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Bell, Search } from '@snui/uni-src/components/sn-icon/sn-icon-set'
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue'

registerSnIcons({ Bell, Search })
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar
      type="info"
      prefix="Bell"
      text="prefix swaps in the Bell glyph from the registry, replacing the type glyph."
    />

    <SnNoticeBar
      type="warning"
      prefix="Search"
      :delay="3"
      text="delay=3: the marquee waits 3 seconds before it starts scrolling."
    />

    <SnNoticeBar
      type="danger"
      :speed="120"
      text="speed=120: 120px per second, more than twice the default 50."
    />

    <text class="sn-demo__meta">
      A prefix that misses the registry falls back to the type glyph; delay is in seconds and
      speed in px/s.
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
