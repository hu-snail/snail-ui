<script setup lang="ts">
/** Demo: SnCarousel — marketing banner with title/description captions. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const banners = [
  {
    src: photo('carousel-web-banner-1'),
    alt: '春季新品',
    title: '春季新品发布',
    description: '全品类新品限时 8 折，会员再享积分翻倍',
  },
  {
    src: photo('carousel-web-banner-2'),
    alt: '旅行专区',
    title: '出行季 · 旅行专区',
    description: '机票酒店套餐立减 300 元，支持随时退改',
  },
  {
    src: photo('carousel-web-banner-3'),
    alt: '会员日',
    title: '会员日来袭',
    description: '每月 18 日专属优惠券包，点击立即领取',
  },
];
</script>

<template>
  <SnCarousel draggable dot-type="line" style="height: 280px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem v-for="b in banners" :key="b.src" :title="b.title" :description="b.description">
      <img :src="b.src" :alt="b.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
