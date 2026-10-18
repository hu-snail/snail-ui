<script setup lang="ts">
/** Demo: SnCarousel — slides-per-view with space-between and no loop. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const images = [
  { src: 'https://picsum.photos/id/1080/400/300', alt: '草莓' },
  { src: 'https://picsum.photos/id/1082/400/300', alt: '北极熊' },
  { src: 'https://picsum.photos/id/1084/400/300', alt: '海象' },
  { src: 'https://picsum.photos/id/1087/400/300', alt: '海岛' },
  { src: 'https://picsum.photos/id/1089/400/300', alt: '花' },
]
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
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
