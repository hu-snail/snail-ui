<script setup lang="ts">
/**
 * Demo: sn-steps — custom nodes and the content slot.
 *
 * The `node` slot replaces the default indicator wholesale (covering the step
 * number / status glyph), so a host can draw a badge, avatar or any shape; the
 * connector line is container furniture and keeps rendering.
 * The `content` slot replaces the whole content region (title + description),
 * while the `title` / `description` slots each replace one part.
 *
 * Every icon goes through SnIcon with the built-in icon set (AGENTS.md §113:
 * UI icons must never be emoji).
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Check, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">the node slot replaces the default indicator</text>
    <SnSteps :active="1">
      <SnStep title="Order placed" description="09:00">
        <template #node>
          <view class="sn-demo__node">
            <SnIcon :icon="Check" :size="'var(--sn-mp-icon-size-small)'" />
          </view>
        </template>
      </SnStep>
      <SnStep title="Shipped" description="In progress">
        <template #node>
          <view class="sn-demo__node sn-demo__node--current">
            <SnIcon :icon="User" :size="'var(--sn-mp-icon-size-small)'" />
          </view>
        </template>
      </SnStep>
      <SnStep title="Delivered" description="Pending">
        <template #node>
          <view class="sn-demo__node sn-demo__node--square">
            <text class="sn-demo__node-text">3</text>
          </view>
        </template>
      </SnStep>
    </SnSteps>

    <text class="sn-demo__label">the content slot replaces the content region</text>
    <SnSteps :active="0" vertical space="16rpx">
      <SnStep>
        <template #content>
          <view class="sn-demo__content">
            <text class="sn-demo__title">Payment received</text>
            <text class="sn-demo__desc">Order SN20261030001, amount 128.00</text>
          </view>
        </template>
      </SnStep>
      <SnStep title="Awaiting dispatch" description="Ships within 24 hours" />
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

/* A custom node brings its own look and size; the connector stays outside. */
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
