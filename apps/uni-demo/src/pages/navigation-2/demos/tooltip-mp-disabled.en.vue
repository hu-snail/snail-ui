<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — English shadow of tooltip-mp-disabled.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip content="A disabled tooltip cannot be opened" disabled placement="top">
      <SnButton block disabled>Disabled</SnButton>
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
