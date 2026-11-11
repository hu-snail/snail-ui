<script setup lang="ts">
/**
 * Demo: sn-steps — Root styling: `custom-class`.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="1" custom-class="steps-brand">
      <SnStep title="Order" description="09:00" />
      <SnStep title="Pay" description="09:05" />
      <SnStep title="Ship" description="Pending" />
    </SnSteps>
    <text class="sn-demo__meta">custom-class="steps-brand" mounts a custom class on the root for host-side style overrides.</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}

:deep(.steps-brand) {
  padding: 24rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
