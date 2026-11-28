<script setup lang="ts">
/**
 * Demo: sn-swipe-action (uni-end) — disabled.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swipe-action from its SFC source.
 */
import { ref } from 'vue';

import SnSwipeAction from '@snui/uni-src/components/sn-swipe-action/sn-swipe-action.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Trash } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const locked = ref<'left' | 'close' | 'right'>('close');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwipeAction v-model="locked" disabled>
      <view class="sw-card">
        <view class="sw-card__body">
          <text class="sw-card__title">disabled：手势被忽略，行保持关闭</text>
          <text class="sw-card__snippet">状态：{{ locked }}</text>
        </view>
      </view>

      <template #right>
        <view class="sw-pillbar">
          <view class="sw-pill sw-pill--danger">
            <view class="sw-pill__content">
              <SnIcon :icon="Trash" :size="20" />
              <text class="sw-pill__label">删除</text>
            </view>
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

/* 浮卡：表面由 demo 自绘，组件不画背景。 */
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
</style>
