<script setup lang="ts">
/** Demo: SnCarousel — `mousewheel`: scroll the wheel over the slides to switch. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const slides = [
  { src: photo('carousel-web-mousewheel-1'), alt: 'Slide 1' },
  { src: photo('carousel-web-mousewheel-2'), alt: 'Slide 2' },
  { src: photo('carousel-web-mousewheel-3'), alt: 'Slide 3' },
  { src: photo('carousel-web-mousewheel-4'), alt: 'Slide 4' },
];
</script>

<template>
  <div>
    <p class="demo-hint">Hover the carousel and scroll the wheel to flip slides (mousewheel).</p>
    <SnCarousel
      mousewheel
      draggable
      :transition-style="{ transitionDuration: '500ms' }"
      style="height: 220px; border-radius: 8px; overflow: hidden"
    >
      <SnCarouselItem v-for="s in slides" :key="s.src">
        <img :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover" />
      </SnCarouselItem>
    </SnCarousel>
  </div>
</template>

<style scoped>
.demo-hint {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
