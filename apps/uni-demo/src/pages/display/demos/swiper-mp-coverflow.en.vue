<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow peeking + scale indicator (AUI-additive).
 * Mirrors the design mock "Card & Peeking": a full-size rounded centre card,
 * neighbours peeking via previous/next-margin and scaled down; peek width =
 * previous/next-margin, shrink = coverflow-scale.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** Peeking demo (picsum, stable per seed). */
const peekSlides = [
  { value: 'https://picsum.photos/seed/snui-peek-1/640/420', text: 'Warm light & shadow' },
  { value: 'https://picsum.photos/seed/snui-peek-2/640/420', text: 'Morning light' },
  { value: 'https://picsum.photos/seed/snui-peek-3/640/420', text: 'Nordic green living' },
  { value: 'https://picsum.photos/seed/snui-peek-4/640/420', text: 'Mediterranean summer' },
  { value: 'https://picsum.photos/seed/snui-peek-5/640/420', text: 'Dusk resort' },
];

/** Scale / depth demo (larger offset + lower scale for a stronger stack). */
const scaleSlides = [1, 2, 3, 4].map((n) => ({
  value: `https://picsum.photos/seed/snui-scale-${n}/640/420`,
  text: `Motion design ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">Peeking Cards</text>
        <text class="sn-demo__tag">peeking on both edges</text>
      </view>
      <!-- Peek width = previous/next-margin (120rpx here); scale dots + arrows centred below -->
      <SnSwiper
        :list="peekSlides"
        coverflow
        previous-margin="120rpx"
        next-margin="120rpx"
        height="400rpx"
        radius="24rpx"
        :indicator="{ type: 'scale', showControls: true }"
        indicator-position="bottom"
      />
    </view>

    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">3D Scale Effect</text>
        <text class="sn-demo__tag">depth stack</text>
      </view>
      <!-- coverflowScale=0.78: smaller inactive cards, stronger depth; default 80rpx peek -->
      <SnSwiper
        :list="scaleSlides"
        coverflow
        :coverflow-scale="0.78"
        height="400rpx"
        radius="24rpx"
        autoplay
        :indicator="{ type: 'scale', showControls: true }"
      />
    </view>

    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">Flat (control)</text>
        <text class="sn-demo__tag">no coverflow</text>
      </view>
      <SnSwiper :list="peekSlides" height="400rpx" radius="24rpx" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.sn-demo__block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-demo__head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.sn-demo__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__tag {
  font-size: 22rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
