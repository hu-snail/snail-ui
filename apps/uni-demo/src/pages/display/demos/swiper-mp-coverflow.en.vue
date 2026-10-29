<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow peeking (AUI-additive).
 * Peek width is controlled by previous-margin / next-margin; the inactive
 * slide shrink is controlled by coverflow-scale.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** 6 demo images (picsum, stable per seed). */
const slides = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: `https://picsum.photos/seed/snui-coverflow-${n}/600/400`,
  text: `Card ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · default peek (80rpx)</text>
      <SnSwiper :list="slides" coverflow height="360rpx" radius="24rpx" autoplay />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · custom peek width (previous/next-margin=120rpx) + scale 0.8</text>
      <SnSwiper
        :list="slides"
        coverflow
        :coverflow-scale="0.8"
        previous-margin="120rpx"
        next-margin="120rpx"
        height="360rpx"
        radius="24rpx"
        :indicator="{ type: 'scale' }"
      />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · scale indicator + prev/next arrows</text>
      <SnSwiper
        :list="slides"
        coverflow
        height="360rpx"
        radius="24rpx"
        :indicator="{ type: 'scale', showControls: true }"
      />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">Flat mode (control, no coverflow)</text>
      <SnSwiper :list="slides" height="360rpx" radius="24rpx" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-demo__block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
