<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — English shadow of tooltip-mp-close.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const withClose = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      :model-value="withClose"
      content="With a close button — tap × to dismiss"
      :show-close="true"
      :offset="{ x: 0, y: 6 }"
      placement="top"
      @update:model-value="withClose = $event"
    >
      <SnButton block>Close button + offset</SnButton>
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
