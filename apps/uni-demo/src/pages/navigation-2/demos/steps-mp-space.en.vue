<script setup lang="ts">
/**
 * Demo: sn-steps — English shadow of steps-mp-space.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="1" space="120rpx" align-center>
      <SnStep title="Order" description="09:00" />
      <SnStep title="Payment" description="09:05" />
      <SnStep title="Dispatch" description="Pending" />
    </SnSteps>

    <text class="sn-demo__meta">
      space="120rpx" widens the gaps; align-center centres the whole row (horizontal only).
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
