<script setup lang="ts">
/** Demo: sn-button — 加载 spinner 定制（`loadingColor` / `loadingSize`）。 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">loading-color / loading-size 改 spinner</text>
    <view class="sn-demo__row">
      <SnButton loading loading-color="var(--sn-mp-color-feedback-success)" type="primary">
        loading-color
      </SnButton>
      <SnButton loading loading-size="48" type="success">loading-size</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
</style>
