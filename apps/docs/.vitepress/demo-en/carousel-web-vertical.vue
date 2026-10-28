<script setup lang="ts">
/** Demo: SnCarousel — vertical direction with dots on the right. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-vertical-1', 600, 500), alt: 'Lighthouse' },
  { src: photo('carousel-web-vertical-2', 600, 500), alt: 'Puppy' },
  { src: photo('carousel-web-vertical-3', 600, 500), alt: 'Flower field' },
];
</script>

<template>
  <div class="demo-row">
    <SnCarousel
      draggable
      direction="vertical"
      dot-placement="right"
      style="width: 320px; height: 280px; border-radius: 8px; overflow: hidden"
    >
      <SnCarouselItem v-for="img in images" :key="img.src">
        <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
      </SnCarouselItem>
    </SnCarousel>
    <p class="demo-hint">
      Vertical scrolling with dots on the right; wheel/touch switches along the Y axis.
    </p>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 24px;
  align-items: center;
}
.demo-hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
