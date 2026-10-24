<script setup lang="ts">
/** Demo: sn-steps — basic step indicator. */
import { ref } from 'vue'
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue'
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue'

const active = ref(1)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="active">
      <SnStep title="Order placed" description="Submitted" />
      <SnStep title="Shipped" description="In progress" />
      <SnStep title="Delivered" description="Pending" />
    </SnSteps>
    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="active = Math.max(0, active - 1)">Back</text>
      <text class="sn-demo__button" @tap="active = Math.min(2, active + 1)">Next</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__actions {
  display: flex;
  gap: 8px;
}
.sn-demo__button {
  padding: 6px 12px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
