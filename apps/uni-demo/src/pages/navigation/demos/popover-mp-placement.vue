<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — four directions. Per AUI-DOCS-016: imports the
 * real @snui/uni sn-popover.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const options = ['top', 'right', 'bottom', 'left'] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__grid">
      <SnPopover
        v-for="item in options"
        :key="item"
        :placement="item"
        content="文字提示"
        custom-class="sn-popover-demo__cell"
      >
        <SnButton size="small">{{ item }}</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

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
.sn-popover-demo__grid {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.sn-popover-demo__space {
  height: 260rpx;
}
/* uni-app x 的 view 默认 overflow: hidden——包装类全链放开（AGENTS.md §103）。 */
.sn-popover-demo__grid,
.sn-popover-demo__space {
  overflow: visible;
}
</style>
