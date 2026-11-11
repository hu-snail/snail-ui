<script setup lang="ts">
/**
 * Demo: sn-steps — English shadow of steps-mp-status.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="1">
      <SnStep title="Approved" description="Passed" status="finished" />
      <SnStep title="Manual review" description="In progress" status="process" />
      <SnStep title="Auto-passed" description="Skipped" status="wait" />
    </SnSteps>

    <text class="sn-demo__meta">
      Each step overrides the status derived from active with an explicit status.
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
