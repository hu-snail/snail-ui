<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — normal mode with plain text content.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="open"
      mode="normal"
      content="3 tasks are left today — start with the two overdue ones."
      placement="bottom"
      :show-close="true"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" block>Show the bubble</SnButton>
    </SnPopover>

    <text class="sn-popover-demo__meta"> State: {{ open ? 'open' : 'closed' }} </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popover-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
