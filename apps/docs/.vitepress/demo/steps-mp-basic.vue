<script setup lang="ts">
/** Demo: sn-steps — 基础步骤条。 */
import { ref } from 'vue'
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue'
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue'

const active = ref(1)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="active">
      <SnStep title="提交订单" description="已提交" />
      <SnStep title="商家发货" description="进行中" />
      <SnStep title="确认收货" description="待处理" />
    </SnSteps>
    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="active = Math.max(0, active - 1)">上一步</text>
      <text class="sn-demo__button" @tap="active = Math.min(2, active + 1)">下一步</text>
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
