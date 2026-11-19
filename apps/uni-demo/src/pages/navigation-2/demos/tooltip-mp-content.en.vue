<script setup lang="ts">
/**
 * Demo: sn-tooltip — multi-line TEXT-ONLY content.
 *
 * - an array `content` renders one plain-text line per entry; the tooltip
 *   carries text hints only — rich cards (icon / title / description /
 *   actions) belong to sn-popover
 * - `offset` accepts `number`, `[x, y]` and `{ x, y }`, folded into the
 *   placement through `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y`
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const rowsOpen = ref(false);
const singleOpen = ref(false);

const rows = ['Ships within 48 hours', 'Free shipping over $99', '7-day free returns'];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      v-model="rowsOpen"
      :content="rows"
      placement="bottom"
      :offset="[0, 8]"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Multi-line (array content)</SnButton>
    </SnTooltip>

    <SnTooltip
      v-model="singleOpen"
      content="Dark plate, text-only hint — rich cards live in sn-popover"
      placement="top"
      :offset="{ x: 0, y: 10 }"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Single line</SnButton>
    </SnTooltip>

    <text class="sn-demo__meta"
      >State: {{ rowsOpen ? 'multi-line open' : 'multi-line closed' }} /
      {{ singleOpen ? 'single open' : 'single closed' }}</text
    >
    <text class="sn-demo__hint"
      >The tooltip carries text hints only: dark plate (the toast token pair); rich bubbles /
      menus / bottom sheets use sn-popover.</text
    >
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
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-tooltip.sn-demo-contained) {
  position: relative;
}
</style>
