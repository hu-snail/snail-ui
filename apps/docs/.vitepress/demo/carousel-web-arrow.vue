<script setup lang="ts">
/** Demo: SnCarousel — built-in prev/next arrows (show-arrow). */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const images = [
  { src: 'https://picsum.photos/id/1043/800/400', alt: '夜景' },
  { src: 'https://picsum.photos/id/1044/800/400', alt: '灯串' },
  { src: 'https://picsum.photos/id/1048/800/400', alt: '咖啡' },
]
</script>

<template>
  <SnCarousel show-arrow style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
