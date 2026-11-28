<script setup lang="ts">
/**
 * Demo: sn-steps — connector line type (solid / dashed / dotted).
 *
 * `connector` is owned by the container, so every connector inside it uses the
 * same line type; dashed / dotted are drawn by a real element with
 * `border-style` (no pseudo-element). `dot` steps render no connector at all,
 * so `connector` has no effect in that mode.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">connector="solid" (default line)</text>
    <SnSteps :active="1" align-center>
      <SnStep title="Order placed" description="09:00" />
      <SnStep title="Paid" description="09:05" />
      <SnStep title="Shipped" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">connector="dashed"</text>
    <SnSteps :active="1" connector="dashed" align-center>
      <SnStep title="Order placed" description="09:00" />
      <SnStep title="Paid" description="09:05" />
      <SnStep title="Shipped" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">connector="dotted"</text>
    <SnSteps :active="1" connector="dotted" align-center>
      <SnStep title="Order placed" description="09:00" />
      <SnStep title="Paid" description="09:05" />
      <SnStep title="Shipped" description="Pending" />
    </SnSteps>

    <text class="sn-demo__label">vertical + connector="dashed"</text>
    <SnSteps :active="1" vertical connector="dashed" space="16rpx">
      <SnStep title="Fill in details" description="09:00" />
      <SnStep title="Under review" description="09:05" />
      <SnStep title="Done" description="Pending" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* MP / App drop flex gap: spacing rides on margins (§116). */
.sn-demo__label {
  margin: var(--sn-mp-spacing-4) 0 var(--sn-mp-spacing-2);
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__label:first-child {
  margin-top: 0;
}
</style>
