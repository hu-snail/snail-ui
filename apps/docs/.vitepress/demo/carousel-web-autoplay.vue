<script setup lang="ts">
/** Demo: SnCarousel — autoplay with interval; hover pauses the timer. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-autoplay-1'), alt: '瀑布' },
  { src: photo('carousel-web-autoplay-2'), alt: '雪山' },
  { src: photo('carousel-web-autoplay-3'), alt: '湖泊' },
];
</script>

<template>
  <SnCarousel
    draggable
    autoplay
    :interval="2500"
    style="height: 240px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
