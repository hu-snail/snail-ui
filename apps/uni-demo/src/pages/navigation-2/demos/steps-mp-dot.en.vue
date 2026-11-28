<script setup lang="ts">
/** Demo: sn-steps — English shadow of steps-mp-dot. */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="2" dot align-center>
      <SnStep title="Sign up" />
      <SnStep title="Sign in" />
      <SnStep title="Done" />
    </SnSteps>
    <text class="sn-demo__meta">dot swaps the indicators for plain dots.</text>
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
