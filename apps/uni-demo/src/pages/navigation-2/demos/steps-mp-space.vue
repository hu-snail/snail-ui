<script setup lang="ts">
/**
 * Demo: sn-steps — `space`、`align-center`、显式 `status` 与自定义插槽。
 *
 * - `space` 覆盖指示器之间的默认间距（横向按 `width`，纵向按 `padding-bottom`）
 * - `align-center` 仅横向生效，让步骤条整体居中
 * - `status` 显式覆盖由 `active` 推导出的状态（finished / process / error / wait）
 * - `icon` / `title` / `description` 插槽可完全替换对应区域
 * - `custom-class` / `custom-style` 落在根节点
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">space="120rpx" + align-center</text>
    <SnSteps :active="1" space="120rpx" align-center>
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">显式 status 覆盖推导值 + custom-class</text>
    <SnSteps :active="1" custom-class="sn-demo__steps">
      <SnStep title="审核通过" description="已通过" status="finished" />
      <SnStep title="人工复核" description="进行中" status="process" />
      <SnStep title="自动放行" description="已跳过" status="wait" />
    </SnSteps>

    <text class="sn-demo__label">icon / title / description 插槽</text>
    <SnSteps :active="0" vertical space="24rpx">
      <SnStep>
        <template #icon>
          <view class="sn-demo__dot" />
        </template>
        <template #title>
          <text class="sn-demo__title">自定义标题</text>
        </template>
        <template #description>
          <text class="sn-demo__desc">description 插槽可以放任意结构</text>
        </template>
      </SnStep>
      <SnStep title="普通步骤" description="默认渲染" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__desc {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* custom-class 落在 sn-steps 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__steps) {
  padding: var(--sn-mp-spacing-2) 0;
}
</style>
