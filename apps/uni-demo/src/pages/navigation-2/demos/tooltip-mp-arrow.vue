<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — 箭头（visible-arrow）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const noArrow = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      :model-value="noArrow"
      content="没有箭头的气泡"
      :visible-arrow="false"
      placement="top"
      trigger="manual"
      @update:model-value="noArrow = $event"
    >
      <SnButton block @click="noArrow = !noArrow">无箭头（visible-arrow=false）</SnButton>
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
