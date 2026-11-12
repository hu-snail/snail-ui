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
    >
      <SnButton type="primary" block>Tap for the hint</SnButton>
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
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-tooltip.sn-demo-contained {
  position: relative;
}
/* #endif */
.sn-tooltip-demo__space {
  height: 180rpx;
}
</style>
