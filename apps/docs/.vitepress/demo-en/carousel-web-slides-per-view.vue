<script setup lang="ts">
/** Demo: SnCarousel — slides-per-view with space-between and no loop. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（uview CDN，国内稳定图源）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 中的数字映射到固定的 10 张图库，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://cdn.uviewui.com/uview/album/${([...String(seed)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % 10) + 1}.jpg`;
}

const images = [
  { src: photo('carousel-web-slides-per-view-1', 400, 300), alt: 'Strawberry' },
  { src: photo('carousel-web-slides-per-view-2', 400, 300), alt: 'Polar bear' },
  { src: photo('carousel-web-slides-per-view-3', 400, 300), alt: 'Walrus' },
  { src: photo('carousel-web-slides-per-view-4', 400, 300), alt: 'Island' },
  { src: photo('carousel-web-slides-per-view-5', 400, 300), alt: 'Flower' },
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
