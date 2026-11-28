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
    <SnNavbar
      title="Mini program"
      custom-style="padding-right: 208rpx;"
      @back-home="report('Home')"
    >
      <template #capsule>
        <view class="mp-nav__capsule">
          <view class="mp-nav__capsule-btn" @tap="report('Back')">
            <SnIcon :icon="ChevronLeft" :size="28" />
          </view>
          <view class="mp-nav__capsule-rule" />
          <view class="mp-nav__capsule-btn" @tap="report('Home')">
            <SnIcon :icon="Home" :size="26" />
          </view>
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">
      The 208rpx right inset clears WeChat's system capsule, which the MP environment draws itself
      (the demo does not fake it); do not put right slot content there. With safe-area-inset-top the
      component reserves the measured inset and the status bar automatically.
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
.mp-nav__capsule {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64rpx;
  /* Geometry mirrors the real WeChat capsule (87px × 32px = 174 × 64rpx); quiet look:
   * faint hairline + secondary icon colour. Real hosts need not hand-draw it — sn-navbar
   * renders a built-in capsule in the MP environment when `mp-capsule` is on. */
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-secondary);
}
.mp-nav__capsule-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86rpx;
  height: 100%;
}
.mp-nav__capsule-rule {
  width: 2rpx;
  height: 32rpx;
  background-color: var(--sn-mp-color-border-subtle);
}
</style>
