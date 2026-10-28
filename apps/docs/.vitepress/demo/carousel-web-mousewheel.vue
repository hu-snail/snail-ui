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
  { src: photo('carousel-web-mousewheel-1'), alt: '第一屏' },
  { src: photo('carousel-web-mousewheel-2'), alt: '第二屏' },
  { src: photo('carousel-web-mousewheel-3'), alt: '第三屏' },
  { src: photo('carousel-web-mousewheel-4'), alt: '第四屏' },
];
</script>

<template>
  <div>
    <p class="demo-hint">把鼠标悬停在轮播上滚动滚轮即可翻页（mousewheel）。</p>
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
