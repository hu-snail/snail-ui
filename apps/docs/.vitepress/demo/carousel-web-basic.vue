<script setup lang="ts">
/** Demo: SnCarousel — basic slide loop with loop wrapping. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const images = [
  { src: 'https://picsum.photos/id/1015/800/400', alt: '河流' },
  { src: 'https://picsum.photos/id/1016/800/400', alt: '峡谷' },
  { src: 'https://picsum.photos/id/1018/800/400', alt: '山径' },
]
</script>

<template>
  <SnCarousel style="height: 240px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
