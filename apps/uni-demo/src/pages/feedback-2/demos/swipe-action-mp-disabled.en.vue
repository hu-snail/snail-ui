<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — disabled / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 */
import { ref } from 'vue';
import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';

const enabled = ref<'left' | 'close' | 'right'>('close');
const locked = ref<'left' | 'close' | 'right'>('close');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction
      v-model="enabled"
      custom-class="sn-demo__swipe"
      custom-style="border-radius: var(--sn-mp-radius-md);"
    >
      <view class="sn-demo__row">
        <text class="sn-demo__title">Swipeable + custom-class / custom-style</text>
        <text class="sn-demo__desc">Status: {{ enabled }}</text>
      </view>

      <template #right>
        <view class="sn-demo__action">
          <text class="sn-demo__action-text">Delete</text>
        </view>
      </template>
    </SnSwipeAction>

    <SnSwipeAction v-model="locked" disabled custom-class="sn-demo__swipe">
      <view class="sn-demo__row">
        <text class="sn-demo__title">disabled: the gesture is ignored, the row stays closed</text>
        <text class="sn-demo__desc">Status: {{ locked }}</text>
      </view>

      <template #right>
        <view class="sn-demo__action">
          <text class="sn-demo__action-text">Delete</text>
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
.sn-demo__row {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx 32rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  background-color: var(--sn-mp-color-feedback-danger);
}
.sn-demo__action-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-sm);
}
/* custom-class lands on the sn-swipe-action root node. */
.sn-demo :deep(.sn-demo__swipe) {
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
