<script setup lang="ts">
/**
 * Demo: sn-navbar — English shadow of navbar-mp-capsule.
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
    <!-- Capsule style -->
    <SnNavbar title="Title" right-text="Settings" @click-right="report('Settings')">
      <template #capsule>
        <view class="capsule">
          <view class="capsule__btn" @tap="report('Back')">
            <SnIcon :icon="ChevronLeft" :size="36" />
          </view>
          <view class="capsule__rule" />
          <view class="capsule__btn" @tap="report('Home')">
            <SnIcon :icon="Home" :size="32" />
          </view>
        </view>
      </template>
    </SnNavbar>

    <!-- With search bar -->
    <SnNavbar left-text="Back" right-text="Settings" left-arrow @click-right="report('Settings')">
      <template #left>
        <view class="search-left">
          <SnIcon :icon="ChevronLeft" :size="36" />
          <text class="search-left__text">Back</text>
        </view>
      </template>
      <template #title>
        <view class="search-box">
          <SnIcon :icon="Search" :size="28" />
          <text class="search-box__placeholder">Search</text>
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">Last tap: {{ lastAction }}</text>
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
  /* Mirrors the WeChat system capsule's quiet look: faint hairline + secondary icon colour. */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
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
  background-color: var(--sn-mp-color-border-subtle);
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
