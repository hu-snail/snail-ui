<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — indicator-position 九宫格 + minShowNum 阈值。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

const list = [
  'https://picsum.photos/seed/snui-sw-i1/750/400',
  'https://picsum.photos/seed/snui-sw-i2/750/400',
  'https://picsum.photos/seed/snui-sw-i3/750/400',
];

const two = list.slice(0, 2);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper :list="list" :height="220" indicator-position="top-left" :autoplay="false" />
    <SnSwiper :list="list" :height="220" indicator-position="top-right" :autoplay="false" />
    <SnSwiper :list="list" :height="220" indicator-position="bottom-left" :autoplay="false" />
    <SnSwiper :list="list" :height="220" indicator-position="bottom-right" :autoplay="false" />
    <text class="sn-demo__meta">
      indicator-position 支持 left / top-left / top / top-right / bottom-left / bottom /
      bottom-right / right。
    </text>

    <SnSwiper :list="two" :height="200" :indicator="{ minShowNum: 3 }" :autoplay="false" />
    <text class="sn-demo__meta">minShowNum=3 且只有 2 张：指示器整体隐藏。</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
