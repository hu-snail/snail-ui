<script setup lang="ts">
/**
 * Demo: sn-steps — 自定义节点与节点内容插槽。
 *
 * `node` 插槽完全替换默认节点（覆盖序号 / 状态图标），宿主可以画徽标、
 * 头像或任意形状；连接线由容器拼装，仍会正常渲染。
 * `content` 插槽整体替换内容区（标题 + 描述），`title` / `description`
 * 插槽则各自只替换一部分。
 *
 * 图标一律走 SnIcon + 内置图标集（AGENTS.md §113：UI 图标禁止 emoji）。
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Check, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">node 插槽完全替换默认节点</text>
    <SnSteps :active="1">
      <SnStep title="提交订单" description="09:00">
        <template #node>
          <view class="sn-demo__node">
            <SnIcon :icon="Check" :size="'var(--sn-mp-icon-size-small)'" />
          </view>
        </template>
      </SnStep>
      <SnStep title="商家发货" description="进行中">
        <template #node>
          <view class="sn-demo__node sn-demo__node--current">
            <SnIcon :icon="User" :size="'var(--sn-mp-icon-size-small)'" />
          </view>
        </template>
      </SnStep>
      <SnStep title="确认收货" description="待处理">
        <template #node>
          <view class="sn-demo__node sn-demo__node--square">
            <text class="sn-demo__node-text">3</text>
          </view>
        </template>
      </SnStep>
    </SnSteps>

    <text class="sn-demo__label">content 插槽整体替换内容区</text>
    <SnSteps :active="0" vertical space="16rpx">
      <SnStep>
        <template #content>
          <view class="sn-demo__content">
            <text class="sn-demo__title">支付成功</text>
            <text class="sn-demo__desc">订单号 SN20261030001，金额 128.00</text>
          </view>
        </template>
      </SnStep>
      <SnStep title="等待发货" description="预计 24 小时内发出" />
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

/* 自定义节点自带外观与尺寸，连接线仍由容器拼装。 */
.sn-demo__node {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40rpx;
  height: 40rpx;
  border: 2rpx solid var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-action-primary);
  background-color: var(--sn-mp-color-action-primary-soft);
}

.sn-demo__node--current {
  border-color: var(--sn-mp-color-text-on-primary);
  color: var(--sn-mp-color-text-on-primary);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__node--square {
  border-radius: var(--sn-mp-radius-sm);
}

.sn-demo__node-text {
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: 1;
}

.sn-demo__content {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-2) 0;
}

.sn-demo__title {
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-medium);
}

.sn-demo__desc {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
