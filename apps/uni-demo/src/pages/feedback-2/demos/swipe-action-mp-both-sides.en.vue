<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — left + right action areas and a close guard.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 */
import { ref } from 'vue';

import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';

const both = ref<'left' | 'close' | 'right'>('close');
const guarded = ref<'left' | 'close' | 'right'>('close');

const guardHits = ref(0);

/** Refuse the first close so the blocking behaviour is visible. */
function beforeClose(): boolean {
  guardHits.value += 1;
  return guardHits.value > 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction v-model="both">
      <view class="sn-swipe-demo__row">
        <text class="sn-swipe-demo__title">Both sides can be swiped</text>
        <text class="sn-swipe-demo__desc">State: {{ both }}</text>
      </view>

      <template #left>
        <view class="sn-swipe-demo__action sn-swipe-demo__action--left">
          <text class="sn-swipe-demo__action-text">Star</text>
        </view>
      </template>

      <template #right>
        <view class="sn-swipe-demo__action">
          <text class="sn-swipe-demo__action-text">Delete</text>
        </view>
      </template>
    </SnSwipeAction>

    <SnSwipeAction v-model="guarded" :before-close="beforeClose">
      <view class="sn-swipe-demo__row">
        <text class="sn-swipe-demo__title">before-close blocks the first close</text>
        <text class="sn-swipe-demo__desc">Called {{ guardHits }} time(s)</text>
      </view>

      <template #right>
        <view class="sn-swipe-demo__action">
          <text class="sn-swipe-demo__action-text">Archive</text>
        </view>
      </template>
    </SnSwipeAction>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
.sn-swipe-demo__action--left {
  background: var(--sn-mp-color-action-primary);
}
.sn-swipe-demo__action-text {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-on-primary);
}
</style>
