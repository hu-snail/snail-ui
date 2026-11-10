<script setup lang="ts">
/**
 * Demo: sn-steps — 间距与对齐（space / align-center）。
 *
 * - `space` 覆盖指示器之间的默认间距（横向按 `width`，纵向按 `padding-bottom`）
 * - `align-center` 仅横向生效，让步骤条整体居中
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="1" space="120rpx" align-center>
      <SnStep title="下单" description="09:00" />
      <SnStep title="支付" description="09:05" />
      <SnStep title="发货" description="待处理" />
    </SnSteps>

    <text class="sn-demo__meta">space="120rpx" 拉开间距；align-center 让步骤条整体居中（仅横向）。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
