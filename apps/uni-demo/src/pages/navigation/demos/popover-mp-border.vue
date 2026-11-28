<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — custom bubble border colour. Per
 * AUI-DOCS-016: imports the real @snui/uni sn-popover.
 *
 * Side-by-side: the borderless reference card vs a consumer-coloured border
 * (borderColor). The arrow follows the bubble fill only — the border is a
 * body-only outline (documented divergence).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__pair">
      <SnPopover placement="bottom" content="无边框（默认）" custom-class="sn-popover-demo__cell">
        <SnButton size="small">无边框</SnButton>
      </SnPopover>
      <SnPopover
        placement="bottom"
        content="自定义边框颜色"
        border-color="#2563eb"
        custom-class="sn-popover-demo__cell"
      >
        <SnButton size="small">蓝色边框</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">border-color：默认无边框 / 设置后画 1px 边框</text>
    <text class="sn-demo__hint">边框仅绘制在气泡主体上；箭头跟随气泡底色（无边框）。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__pair {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.sn-popover-demo__space {
  height: 220rpx;
}
/* uni-app x 的 view 默认 overflow: hidden——包装类全链放开（AGENTS.md §103）。 */
.sn-popover-demo__pair,
.sn-popover-demo__space {
  overflow: visible;
}
</style>
