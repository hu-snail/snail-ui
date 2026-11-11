<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — 禁用（disabled）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip content="禁用状态点不动" disabled placement="top">
      <SnButton block disabled>禁用</SnButton>
    </SnTooltip>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-top: 40rpx;
}
</style>
