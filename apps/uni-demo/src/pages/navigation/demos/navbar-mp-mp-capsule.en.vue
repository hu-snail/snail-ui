<script setup lang="ts">
/**
 * Demo: sn-navbar — English shadow of navbar-mp-mp-capsule.
 */
import { ref } from 'vue';
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { ChevronLeft, Home } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const lastAction = ref('—');

function report(label: string): void {
  lastAction.value = label;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="mp-nav">
      <SnNavbar
        title="Mini program"
        custom-style="padding-right: 208rpx;"
        @back-home="report('Home')"
      >
        <template #capsule>
          <view class="mp-nav__capsule">
            <view class="mp-nav__capsule-btn" @tap="report('Back')">
              <SnIcon :icon="ChevronLeft" :size="36" />
            </view>
            <view class="mp-nav__capsule-rule" />
            <view class="mp-nav__capsule-btn" @tap="report('Home')">
              <SnIcon :icon="Home" :size="32" />
            </view>
          </view>
        </template>
      </SnNavbar>

      <!-- Illustration only: on a real device WeChat draws the native capsule. -->
      <view class="mp-nav__system">
        <text class="mp-nav__dots">•••</text>
        <view class="mp-nav__system-rule" />
        <text class="mp-nav__target">⊙</text>
      </view>
    </view>

    <text class="sn-demo__meta">
      The 208rpx right inset clears WeChat's system capsule in custom navigation; do not put right
      slot content there. With safe-area-inset-top the component reserves the measured inset and the
      status bar automatically.
    </text>
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
  padding: 0 32rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.mp-nav {
  position: relative;
}
.mp-nav__capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  /* Mirrors the WeChat system capsule's quiet look: faint hairline + secondary icon colour.
   * Real hosts need not hand-draw it — sn-navbar renders a built-in capsule in the MP
   * environment when `mp-capsule` is on. */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
}
.mp-nav__capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 100%;
}
.mp-nav__capsule-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-subtle);
}
.mp-nav__system {
  position: absolute;
  top: 12rpx;
  right: 16rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 64rpx;
  padding: 0 20rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
}
.mp-nav__dots {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.mp-nav__system-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-default);
}
.mp-nav__target {
  font-size: 32rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
