<script setup lang="ts">
/** Demo: SnCarousel — slides-per-view with space-between and no loop. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-slides-per-view-1', 400, 300), alt: '草莓' },
  { src: photo('carousel-web-slides-per-view-2', 400, 300), alt: '北极熊' },
  { src: photo('carousel-web-slides-per-view-3', 400, 300), alt: '海象' },
  { src: photo('carousel-web-slides-per-view-4', 400, 300), alt: '海岛' },
  { src: photo('carousel-web-slides-per-view-5', 400, 300), alt: '花' },
];
</script>

<template>
  <SnCarousel
    draggable
    :slides-per-view="3"
    :space-between="12"
    :loop="false"
    show-arrow
    style="height: 200px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
