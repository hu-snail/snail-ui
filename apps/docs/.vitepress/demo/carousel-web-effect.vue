<script setup lang="ts">
/** Demo: SnCarousel — effect comparison: slide / fade / card. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

const effects = ['slide', 'fade', 'card'] as const;
/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-effect-1'), alt: '峡谷公路' },
  { src: photo('carousel-web-effect-2'), alt: '海浪' },
  { src: photo('carousel-web-effect-3'), alt: '湖泊' },
];
</script>

<template>
  <div class="demo-col">
    <div v-for="effect in effects" :key="effect">
      <p class="demo-label">effect="{{ effect }}"</p>
      <SnCarousel
        draggable
        :effect="effect"
        :transition-style="{ transitionDuration: '500ms' }"
        style="height: 200px; border-radius: 8px; overflow: hidden"
      >
        <SnCarouselItem v-for="img in images" :key="img.src">
          <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
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
