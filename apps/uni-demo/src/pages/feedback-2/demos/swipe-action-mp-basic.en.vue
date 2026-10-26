<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — right action area with a delete button.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 */
import { ref } from 'vue';

import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';

const status = ref<'left' | 'close' | 'right'>('close');
const removed = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction v-model="status">
      <view class="sn-swipe-demo__row">
        <text class="sn-swipe-demo__title">Swipe left to reveal Delete</text>
        <text class="sn-swipe-demo__desc">State: {{ status }}</text>
      </view>

      <template #right>
        <view class="sn-swipe-demo__action" @tap="removed = true">
          <text class="sn-swipe-demo__action-text">Delete</text>
        </view>
      </template>
    </SnSwipeAction>

    <text class="sn-swipe-demo__meta">
      {{ removed ? 'The delete action was tapped' : 'Try swiping' }}
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-swipe-demo__row {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx 32rpx;
}
.sn-swipe-demo__title {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-swipe-demo__desc {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-swipe-demo__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  background: var(--sn-mp-color-feedback-danger);
}
.sn-swipe-demo__action-text {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-on-primary);
}
.sn-swipe-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
