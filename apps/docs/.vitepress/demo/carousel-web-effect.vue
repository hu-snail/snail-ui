<script setup lang="ts">
/** Demo: SnCarousel — effect comparison: slide / fade / card. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const effects = ['slide', 'fade', 'card'] as const
const images = [
  { src: 'https://picsum.photos/id/1074/800/400', alt: '狮子' },
  { src: 'https://picsum.photos/id/1076/800/400', alt: '海浪' },
  { src: 'https://picsum.photos/id/1079/800/400', alt: '峡谷公路' },
]
</script>

<template>
  <div class="demo-col">
    <div v-for="effect in effects" :key="effect">
      <p class="demo-label">effect="{{ effect }}"</p>
      <SnCarousel
        :effect="effect"
        :transition-style="{ transitionDuration: '500ms' }"
        style="height: 200px; border-radius: 8px; overflow: hidden"
      >
        <SnCarouselItem v-for="img in images" :key="img.src">
          <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
        </SnCarouselItem>
      </SnCarousel>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo-label {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
