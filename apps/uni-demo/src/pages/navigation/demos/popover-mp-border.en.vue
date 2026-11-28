<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — custom bubble border colour (EN twin).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__pair">
      <SnPopover placement="bottom" content="Borderless (default)" custom-class="sn-popover-demo__cell">
        <SnButton size="small">Borderless</SnButton>
      </SnPopover>
      <SnPopover
        placement="bottom"
        content="Custom border colour"
        border-color="#2563eb"
        custom-class="sn-popover-demo__cell"
      >
        <SnButton size="small">Blue border</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">border-color: borderless by default / a 1px border when set</text>
    <text class="sn-demo__hint">The border draws on the bubble body only; the arrow follows the bubble fill (no border).</text>
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
