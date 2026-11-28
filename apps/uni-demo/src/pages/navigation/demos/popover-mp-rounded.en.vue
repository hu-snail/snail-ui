<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — arrow tip shapes (EN twin).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__pair">
      <SnPopover placement="bottom" content="Sharp arrow (default)" custom-class="sn-popover-demo__cell">
        <SnButton size="small">Sharp</SnButton>
      </SnPopover>
      <SnPopover placement="bottom" content="Rounded arrow" arrow-shape="rounded" custom-class="sn-popover-demo__cell">
        <SnButton size="small">Rounded</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">arrow-shape: sharp (default) / rounded</text>
    <text class="sn-demo__hint">The rounded tip is a soft-cornered square fused with the bubble; both follow the bubble fill.</text>
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
