<script setup lang="ts">
/**
 * Demo: sn-steps — 连接线类型（solid / dashed / dotted）。
 *
 * `connector` 由容器统一持有，容器内每个步骤的连接线使用同一样式；
 * 虚线 / 点线由真实元素 + `border-style` 绘制，不使用伪元素。
 * `dot` 点状步骤条不渲染连接线，`connector` 在该模式下无效果。
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">connector="solid"（默认直线）</text>
    <SnSteps :active="1">
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">connector="dashed"（虚线）</text>
    <SnSteps :active="1" connector="dashed">
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">connector="dotted"（点线）</text>
    <SnSteps :active="1" connector="dotted">
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">vertical + connector="dashed"</text>
    <SnSteps :active="1" vertical connector="dashed" space="16rpx">
      <SnStep title="填写信息" description="09:00" />
      <SnStep title="审核中" description="09:05" />
      <SnStep title="完成" description="待处理" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
