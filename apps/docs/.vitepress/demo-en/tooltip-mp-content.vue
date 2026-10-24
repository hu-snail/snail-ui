<script setup lang="ts">
/**
 * Demo: sn-tooltip — multi-line content and the `content` slot.
 *
 * - an array `content` renders one line per entry (objects contribute whichever of
 *   `label` / `text` / `content` / `name` is present)
 * - the `content` slot replaces the body entirely, so any `<view>` / `<text>`
 *   structure is allowed
 * - `offset` accepts `number`, `[x, y]` and `{ x, y }`; it participates in the
 *   positioning through `--sn-tooltip-offset-x` / `--sn-tooltip-offset-y`
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble's
 * positioning context inside the demo.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue'

const rowsOpen = ref(false)
const slotOpen = ref(false)

const rows = [
  { label: 'Dispatch: within 48 hours' },
  { label: 'Shipping: free over $99' },
  '7-day returns, no questions asked',
]
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
      <SnButton block>Multi-line hint (array content)</SnButton>
    </SnTooltip>

    <SnTooltip
      v-model="slotOpen"
      placement="top"
      :offset="{ x: 0, y: 10 }"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Slot content</SnButton>
      <template #content>
        <view class="sn-demo__bubble">
          <text class="sn-demo__bubble-title">Custom bubble</text>
          <text class="sn-demo__bubble-text">The content slot accepts any structure, so the body is no longer limited to the content string.</text>
        </view>
      </template>
    </SnTooltip>

    <text class="sn-demo__meta">State: {{ rowsOpen ? 'rows open' : 'rows closed' }} / {{ slotOpen ? 'slot open' : 'slot closed' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__bubble {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
}
.sn-demo__bubble-title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__bubble-text {
  font-size: 22rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-tooltip.sn-demo-contained) {
  position: relative;
}
</style>
