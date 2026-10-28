<script setup lang="ts">
/** Demo: SnCarousel — dots: dot/line shapes and bottom/left placement. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const images = [
  { src: photo('carousel-web-dots-1'), alt: '海岸' },
  { src: photo('carousel-web-dots-2'), alt: '森林' },
  { src: photo('carousel-web-dots-3'), alt: '公路' },
];
</script>

<template>
  <div class="demo-col">
    <div>
      <p class="demo-label">dot-type="line"</p>
      <SnCarousel
        draggable
        dot-type="line"
        style="height: 200px; border-radius: 8px; overflow: hidden"
      >
        <SnCarouselItem v-for="img in images" :key="img.src">
          <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
        </SnCarouselItem>
      </SnCarousel>
    </div>
    <div>
      <p class="demo-label">dot-placement="left"</p>
      <SnCarousel
        draggable
        dot-placement="left"
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
