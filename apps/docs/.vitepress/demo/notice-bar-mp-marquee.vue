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
      text="prefix 换成注册表里的 Bell 图标，替换默认的 type 字形。"
    />

    <SnNoticeBar
      type="warning"
      prefix="Search"
      :delay="3"
      text="delay=3：跑马灯延迟 3 秒才开始滚动。"
    />

    <SnNoticeBar
      type="danger"
      :speed="120"
      text="speed=120：每秒 120px 的滚动速度，比默认的 50 快一倍多。"
    />

    <text class="sn-demo__meta">
      prefix 未命中注册表时回落到 type 字形；delay 单位为秒，speed 单位为 px/s。
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
