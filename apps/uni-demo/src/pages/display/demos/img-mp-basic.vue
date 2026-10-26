<script setup lang="ts">
/**
 * Demo: sn-img (uni-end) — crop modes, shapes and radius.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img from its SFC source.
 */
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';

const demo = 'https://picsum.photos/seed/snui-img-a/400/300';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-img-demo__row">
      <SnImg :src="demo" mode="scaleToFill" width="160rpx" height="160rpx" />
      <SnImg :src="demo" mode="aspectFit" width="160rpx" height="160rpx" />
      <SnImg :src="demo" mode="aspectFill" width="160rpx" height="160rpx" />
    </view>

    <view class="sn-img-demo__row">
      <SnImg :src="demo" round width="140rpx" height="140rpx" />
      <SnImg :src="demo" :radius="24" width="200rpx" height="140rpx" />
      <SnImg :src="demo" width="100%" height="200rpx" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-img-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
</style>
