<script setup lang="ts">
/** Demo: SnCarousel — basic slide loop with loop wrapping. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-basic-1'), alt: '河流' },
  { src: photo('carousel-web-basic-2'), alt: '峡谷' },
  { src: photo('carousel-web-basic-3'), alt: '山径' },
];
</script>

<template>
  <SnCarousel draggable style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
