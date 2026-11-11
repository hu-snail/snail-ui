<script setup lang="ts">
/** Demo: sn-steps — English shadow of steps-mp-dot. */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="2" dot>
      <SnStep title="One" />
      <SnStep title="Two" />
      <SnStep title="Three" />
    </SnSteps>
    <text class="sn-demo__meta">dot swaps the indicators for plain dots.</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
