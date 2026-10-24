<script setup lang="ts">
/**
 * Demo: sn-loading (uni-end) — the four spinner types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loading from its SFC source.
 */
import SnLoading from '@snui/uni-src/components/sn-loading/sn-loading.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-loading-demo__row">
      <view class="sn-loading-demo__cell">
        <SnLoading type="circular" />
        <text class="sn-loading-demo__name">circular</text>
      </view>
      <view class="sn-loading-demo__cell">
        <SnLoading type="spinner" />
        <text class="sn-loading-demo__name">spinner</text>
      </view>
      <view class="sn-loading-demo__cell">
        <SnLoading type="dots" />
        <text class="sn-loading-demo__name">dots</text>
      </view>
      <view class="sn-loading-demo__cell">
        <SnLoading type="wave" />
        <text class="sn-loading-demo__name">wave</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-loading-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
  align-items: flex-end;
}
.sn-loading-demo__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}
.sn-loading-demo__name {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
