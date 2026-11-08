<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow peeking + scale indicator (AUI-additive).
 * Full-size rounded centre card, neighbours peeking via previous/next-margin
 * and scaled by coverflow-scale; 400ms ease-out transform transition; captions
 * use a diffused shadow scrim, not a solid black bar.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** Peeking demo (picsum, stable per seed). */
const peekSlides = [
  { value: 'https://picsum.photos/seed/snui-peek-1/640/420', text: 'Nordic green living' },
  { value: 'https://picsum.photos/seed/snui-peek-2/640/420', text: 'Mediterranean summer' },
  { value: 'https://picsum.photos/seed/snui-peek-3/640/420', text: 'Morning light' },
  { value: 'https://picsum.photos/seed/snui-peek-4/640/420', text: 'Dusk resort' },
  { value: 'https://picsum.photos/seed/snui-peek-5/640/420', text: 'Warm light & shadow' },
];

/** Depth stack demo (lower coverflow-scale, stronger depth). */
const scaleSlides = [1, 2, 3, 4].map((n) => ({
  value: `https://picsum.photos/seed/snui-scale-${n}/640/420`,
  text: `Motion design ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- Peeking cards: 120rpx peek + scale dots + both-side arrows -->
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

    <!-- Depth stack: coverflowScale=0.78, smaller inactive cards; default 80rpx peek -->
    <SnSwiper
      :list="scaleSlides"
      coverflow
      :coverflow-scale="0.78"
      height="400rpx"
      radius="24rpx"
      autoplay
      :indicator="{ type: 'scale', showControls: true }"
    />

    <!-- Bare images, no captions, no indicator -->
    <SnSwiper
      :list="peekSlides.map((s) => s.value)"
      coverflow
      height="400rpx"
      radius="24rpx"
      :indicator="false"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
