<script setup lang="ts">
/**
 * Demo: sn-img (uni-end) — loading / error / custom slots.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';

const okSrc = 'https://picsum.photos/seed/snui-img-b/400/300';
const brokenSrc = 'https://invalid.example/not-found.png';
const src = ref(okSrc);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnImg :src="src" mode="aspectFill" width="100%" height="200rpx" />

    <view class="sn-img-demo__row">
      <SnButton size="small" @tap="src = okSrc">正常地址</SnButton>
      <SnButton size="small" @tap="src = brokenSrc">错误地址</SnButton>
    </view>

    <SnImg :src="brokenSrc" width="160rpx" height="160rpx">
      <template #error>
        <text class="sn-img-demo__error">加载失败，请重试</text>
      </template>
    </SnImg>

    <SnImg :src="okSrc" width="160rpx" height="160rpx" :show-loading="false" :show-error="false" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-img-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-img-demo__error {
  font-size: 22rpx;
  color: var(--sn-mp-color-feedback-danger);
}
</style>
