<script setup lang="ts">
/** Demo: sn-steps — vertical, dot and error states. */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="1" vertical>
      <SnStep title="Fill in details" description="10:00" />
      <SnStep title="Under review" description="10:05" status="process" />
      <SnStep title="Review failed" description="10:10" status="error" />
    </SnSteps>
    <SnSteps :active="2" dot>
      <SnStep title="One" />
      <SnStep title="Two" />
      <SnStep title="Three" />
    </SnSteps>
    <text class="sn-demo__meta">vertical layout with an error state; dot style below</text>
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
