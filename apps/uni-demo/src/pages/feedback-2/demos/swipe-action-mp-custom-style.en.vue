<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — custom-class / custom-style, EN copy.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 *
 * The component paints no background by default (surfaces belong to the row
 * content); custom-style here gives the root a surface + radius, while the row
 * content carries only text — the other "who paints the surface" option next
 * to the card scenario.
 */
import { ref } from 'vue';

import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Trash } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const enabled = ref<'left' | 'close' | 'right'>('close');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction
      v-model="enabled"
      custom-class="sw-root"
      custom-style="background-color: var(--sn-mp-color-background-elevated); border-radius: 32rpx;"
    >
      <view class="sw-row">
        <text class="sw-row__title">custom-class / custom-style land on the root node</text>
        <text class="sw-row__snippet">Status: {{ enabled }}</text>
      </view>

      <template #right>
        <view class="sw-pillbar">
          <view class="sw-pill sw-pill--danger">
            <SnIcon :icon="Trash" :size="20" />
            <text class="sw-pill__label">Delete</text>
          </view>
        </view>
      </template>
    </SnSwipeAction>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.sw-row {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin: 20rpx 24rpx;
  padding: 32rpx;
}

.sw-row__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sw-row__snippet {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sw-pillbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  padding-right: 24rpx;
}

.sw-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: 136rpx;
  height: 132rpx;
  border-radius: 40rpx;
  color: var(--sn-mp-color-text-on-primary);
}

.sw-pill--danger {
  background-color: var(--sn-mp-color-feedback-danger);
}

.sw-pill__label {
  font-size: 22rpx;
}

/* custom-class lands on the sn-swipe-action root (a parent-scope class reaches
 * the child component's root node). */
.sw-root {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
