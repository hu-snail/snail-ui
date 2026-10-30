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

    <text class="sn-demo__meta">State: {{ open ? 'open' : 'closed' }}</text>
    <text class="sn-demo__hint"
      >Tap anywhere outside the bubble to close it (a transparent mask takes the outside tap); the
      trigger toggles it too.</text
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
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
