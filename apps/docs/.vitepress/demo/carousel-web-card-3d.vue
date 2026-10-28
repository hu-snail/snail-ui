<script setup lang="ts">
/** Demo: SnCarousel — `effect="card"`: built-in 3D card stack. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const slides = [
  {
    src: photo('carousel-web-card-3d-1'),
    alt: '卡片 01',
    title: '全景卡片',
    description: '当前卡片居中，两侧卡片退后缩小',
  },
  {
    src: photo('carousel-web-card-3d-2'),
    alt: '卡片 02',
    title: '侧卡可点',
    description: '点击两侧卡片直接切换到该卡',
  },
  {
    src: photo('carousel-web-card-3d-3'),
    alt: '卡片 03',
    title: '透视景深',
    description: '1000px perspective 的 3D 层叠',
  },
  {
    src: photo('carousel-web-card-3d-4'),
    alt: '卡片 04',
    title: '侧卡样式',
    description: '可用 prev-slide-style / next-slide-style 覆盖',
  },
  {
    src: photo('carousel-web-card-3d-5'),
    alt: '卡片 05',
    title: '无缝循环',
    description: 'loop 默认开启，两端可继续翻页',
  },
];
</script>

<template>
  <SnCarousel
    effect="card"
    show-arrow
    :transition-style="{ transitionDuration: '500ms' }"
    style="height: 280px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="s in slides" :key="s.src" :title="s.title" :description="s.description">
      <img :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
