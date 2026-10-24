<script setup lang="ts">
/** Demo: sn-steps — 垂直、点状与错误状态。 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue'
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="1" vertical>
      <SnStep title="填写信息" description="10:00" />
      <SnStep title="审核中" description="10:05" status="process" />
      <SnStep title="审核失败" description="10:10" status="error" />
    </SnSteps>
    <SnSteps :active="2" dot>
      <SnStep title="一" />
      <SnStep title="二" />
      <SnStep title="三" />
    </SnSteps>
    <text class="sn-demo__meta">vertical + error 状态；dot 点状步骤条</text>
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
