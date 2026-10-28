<script setup lang="ts">
/** Demo: SnCarousel — `effect="card"`: built-in 3D card stack. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const slides = [
  {
    src: photo('carousel-web-card-3d-1'),
    alt: 'Card 01',
    title: 'Panorama card',
    description: 'The active card stays centered; side cards recede and shrink',
  },
  {
    src: photo('carousel-web-card-3d-2'),
    alt: 'Card 02',
    title: 'Side cards are clickable',
    description: 'Click a side card to jump straight to it',
  },
  {
    src: photo('carousel-web-card-3d-3'),
    alt: 'Card 03',
    title: 'Perspective depth',
    description: '3D stacking with 1000px perspective',
  },
  {
    src: photo('carousel-web-card-3d-4'),
    alt: 'Card 04',
    title: 'Side card styling',
    description: 'Overridable via prev-slide-style / next-slide-style',
  },
  {
    src: photo('carousel-web-card-3d-5'),
    alt: 'Card 05',
    title: 'Seamless looping',
    description: 'loop is on by default; paging continues at both ends',
  },
];
</script>

<template>
  <SnCarousel
    effect="card"
    show-arrow
    :transition-style="{ transitionDuration: '500ms' }"
    style="height: 280px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="s in slides" :key="s.src" :title="s.title" :description="s.description">
      <img :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
