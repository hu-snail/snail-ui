<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — four directions. Per AUI-DOCS-016: imports the
 * real @snui/uni sn-popover.
 *
 * The stage gives every bubble room: a generous padding box and wide rows so
 * the top / left / right bubbles open INSIDE the stage instead of covering
 * the neighbouring demo copy (user-reported crowding).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__stage">
      <SnPopover placement="top" content="文字提示" custom-class="sn-popover-demo__cell">
        <SnButton size="small">top</SnButton>
      </SnPopover>

      <view class="sn-popover-demo__middle">
        <SnPopover placement="right" content="文字提示" custom-class="sn-popover-demo__cell">
          <SnButton size="small">right</SnButton>
        </SnPopover>
        <SnPopover placement="left" content="文字提示" custom-class="sn-popover-demo__cell">
          <SnButton size="small">left</SnButton>
        </SnPopover>
      </view>

      <SnPopover placement="bottom" content="文字提示" custom-class="sn-popover-demo__cell">
        <SnButton size="small">bottom</SnButton>
      </SnPopover>
    </view>

    <text class="sn-demo__meta">四个方向：top / right / bottom / left</text>
    <text class="sn-demo__hint">箭头始终指向触发器；点按钮展开，再点一次收起。</text>
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
/*
 * Cross-shaped stage: the top button on the first row, left / right on a wide
 * middle row, bottom on the last row. The padding keeps every bubble (about
 * 110 × 60px plus a 9px arrow) inside the stage — nothing covers the section
 * title above or the meta copy below.
 */
.sn-popover-demo__stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 170rpx;
  padding: 170rpx 60rpx 190rpx;
}
.sn-popover-demo__middle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 150rpx;
}
/* uni-app x 的 view 默认 overflow: hidden——包装类全链放开（AGENTS.md §103）。 */
.sn-popover-demo__stage,
.sn-popover-demo__middle {
  overflow: visible;
}
</style>
