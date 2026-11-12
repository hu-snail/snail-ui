<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — tap-triggered hint with a toggle.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      v-model="open"
      content="Tapping outside does not close it — tap the trigger again"
      placement="bottom"
      custom-class="sn-demo-contained"
      trigger="manual"
    >
      <SnButton type="primary" block @click="open = !open">Tap for the hint</SnButton>
    </SnTooltip>

    <view class="sn-tooltip-demo__space" />

    <text class="sn-tooltip-demo__meta"> State: {{ open ? 'shown' : 'closed' }} </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tooltip-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — relative keeps the demo flow intact while the bubble
 * stays anchored to the component root; the spacer below leaves room for the
 * bottom-placed bubble. */
.sn-tooltip.sn-demo-contained {
  position: relative;
}
.sn-tooltip-demo__space {
  height: 180rpx;
}
</style>
