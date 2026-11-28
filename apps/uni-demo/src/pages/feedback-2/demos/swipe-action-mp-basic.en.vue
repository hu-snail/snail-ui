<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — right action area with a delete pill, EN copy.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 */
import { ref } from 'vue';

import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Trash } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const status = ref<'left' | 'close' | 'right'>('close');
const removed = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction v-model="status">
      <view class="sw-card">
        <view class="sw-card__body">
          <text class="sw-card__title">Swipe left to reveal Delete</text>
          <text class="sw-card__snippet">Status: {{ status }}</text>
        </view>
      </view>

      <template #right>
        <view class="sw-pillbar">
          <view class="sw-pill sw-pill--danger" @tap="removed = true">
            <view class="sw-pill__content">
              <SnIcon :icon="Trash" :size="20" />
              <text class="sw-pill__label">Delete</text>
            </view>
</view>
        </view>
      </template>
    </SnSwipeAction>

    <text class="sw-meta">
      {{ removed ? 'Delete button tapped' : 'Give it a swipe' }}
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

/* Floating card: the demo paints the surface — the component paints none. */
.sw-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20rpx 24rpx;
  padding: 32rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: 0 8rpx 24rpx rgba(15, 23, 42, 0.08);
}

.sw-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.sw-card__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sw-card__snippet {
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 136rpx;
  height: 132rpx;
  border-radius: 40rpx;
  color: var(--sn-mp-color-text-on-primary);
}

/* 图标 + 名称随遮挡距离渐显 / 渐隐（组件经 CSS var 发布进度，200ms 缓动跟手）。 */
.sw-pill__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  opacity: var(--sn-swipe-action-reveal-right, 1);
  transition: opacity 200ms ease-out;
}

.sw-pill--danger {
  background-color: var(--sn-mp-color-feedback-danger);
}

.sw-pill__label {
  font-size: 22rpx;
}

.sw-meta {
  margin: 8rpx 24rpx 0;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
