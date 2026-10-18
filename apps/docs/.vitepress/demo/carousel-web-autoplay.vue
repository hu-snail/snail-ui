<script setup lang="ts">
/** Demo: SnCarousel — autoplay with interval; hover pauses the timer. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const images = [
  { src: 'https://picsum.photos/id/1035/800/400', alt: '瀑布' },
  { src: 'https://picsum.photos/id/1036/800/400', alt: '雪山' },
  { src: 'https://picsum.photos/id/1039/800/400', alt: '湖泊' },
]
</script>

<template>
  <SnCarousel autoplay :interval="2500" style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
