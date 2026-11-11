<script setup lang="ts">
/**
 * Demo: sn-steps — 根节点样式：custom-class。
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="1" custom-class="steps-brand">
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>
    <text class="sn-demo__meta"
      >custom-class="steps-brand" 给根节点挂自定义类，便于宿主覆盖内部样式。</text
    >
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
