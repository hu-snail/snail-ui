<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — placement / arrow / disabled.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const top = ref(false);
const right = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="top"
      content="placement = top, with the arrow"
      placement="top"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Top bubble</SnButton>
    </SnPopover>

    <SnPopover
      v-model="right"
      content="placement = right-start, no arrow"
      placement="right-start"
      :visible-arrow="false"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Right bubble (no arrow)</SnButton>
    </SnPopover>

    <SnPopover
      content="A disabled popover ignores taps"
      disabled
      placement="bottom"
      custom-class="sn-demo-contained"
    >
      <SnButton block disabled>Disabled</SnButton>
    </SnPopover>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 40rpx 0;
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
