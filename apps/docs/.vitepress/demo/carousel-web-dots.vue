<script setup lang="ts">
/** Demo: SnCarousel — dots: dot/line shapes and bottom/left placement. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const images = [
  { src: 'https://picsum.photos/id/1050/800/400', alt: '海岸' },
  { src: 'https://picsum.photos/id/1052/800/400', alt: '森林' },
  { src: 'https://picsum.photos/id/1053/800/400', alt: '公路' },
]
</script>

<template>
  <div class="demo-col">
    <div>
      <p class="demo-label">dot-type="line"</p>
      <SnCarousel dot-type="line" style="height: 200px; border-radius: 8px; overflow: hidden">
        <SnCarouselItem v-for="img in images" :key="img.src">
          <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
        </SnCarouselItem>
      </SnCarousel>
    </div>
    <div>
      <p class="demo-label">dot-placement="left"</p>
      <SnCarousel dot-placement="left" style="height: 200px; border-radius: 8px; overflow: hidden">
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
