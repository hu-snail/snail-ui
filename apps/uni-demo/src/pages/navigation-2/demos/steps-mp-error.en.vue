<script setup lang="ts">
/** Demo: sn-steps — English shadow of steps-mp-error. */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="2" align-center>
      <SnStep title="Submit" description="10:00" />
      <SnStep title="Risk check" description="10:05" />
      <SnStep title="Review failed" description="10:10" status="error" />
    </SnSteps>
    <text class="sn-demo__meta">status="error" marks the step as failed.</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  width: 100%;
}
/* MP / App drop flex gap: spacing rides on margins (§116). */
.sn-demo__meta {
  margin-top: 12px;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
