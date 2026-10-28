<script setup lang="ts">
/** Demo: SnCarousel — marketing banner with title/description captions. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const banners = [
  {
    src: photo('carousel-web-banner-1'),
    alt: 'Spring new arrivals',
    title: 'Spring arrivals launch',
    description: 'Sitewide new arrivals at 20% off for a limited time; members earn double points',
  },
  {
    src: photo('carousel-web-banner-2'),
    alt: 'Travel zone',
    title: 'Travel season · Travel zone',
    description: '¥300 off flight + hotel packages, with flexible cancellation and changes',
  },
  {
    src: photo('carousel-web-banner-3'),
    alt: 'Member Day',
    title: 'Member Day is here',
    description: 'Exclusive coupon pack on the 18th each month — tap to claim now',
  },
];
</script>

<template>
  <SnCarousel draggable dot-type="line" style="height: 280px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="b in banners" :key="b.src" :title="b.title" :description="b.description">
      <img :src="b.src" :alt="b.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
