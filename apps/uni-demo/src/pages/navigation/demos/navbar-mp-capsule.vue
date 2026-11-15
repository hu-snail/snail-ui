<script setup lang="ts">
/**
 * Demo: sn-navbar — 胶囊样式 / 带搜索栏。
 *
 * 对齐参考库 navbar 的「胶囊样式」「带搜索栏」两个场景：
 * - `#capsule` 放微信小程序风格的「返回 + 首页」胶囊，存在时 left 区不渲染；
 * - `#title` 换成胶囊形搜索框，左右两侧仍保留文案按钮。
 */
import { ref } from 'vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ChevronLeft, Home, Search } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const lastAction = ref('—');

function report(label: string): void {
  lastAction.value = label;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 胶囊样式 -->
    <SnNavbar title="标题" right-text="设置" @click-right="report('设置')">
      <template #capsule>
        <view class="capsule">
          <view class="capsule__btn" @tap="report('返回')">
            <SnIcon :icon="ChevronLeft" :size="36" />
          </view>
          <view class="capsule__rule" />
          <view class="capsule__btn" @tap="report('首页')">
            <SnIcon :icon="Home" :size="32" />
          </view>
        </view>
      </template>
    </SnNavbar>

    <!-- 带搜索栏 -->
    <SnNavbar left-text="返回" right-text="设置" left-arrow @click-right="report('设置')">
      <template #left>
        <view class="search-left">
          <SnIcon :icon="ChevronLeft" :size="36" />
          <text class="search-left__text">返回</text>
        </view>
      </template>
      <template #title>
        <view class="search-box">
          <SnIcon :icon="Search" :size="28" />
          <text class="search-box__placeholder">搜索</text>
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">最近一次点击：{{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  padding: 0 32rpx 16rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
}
.capsule__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 100%;
}
.capsule__rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-default);
}
.search-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
}
.search-left__text {
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-action-primary);
}
.search-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  width: 420rpx;
  height: 64rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-text-tertiary);
}
.search-box__placeholder {
  font-size: var(--sn-mp-font-size-md);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
