<script setup lang="ts">
/** Demo: SnCarousel — e-commerce product cards, 3 per view with gaps. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const products = [
  {
    id: 1,
    name: 'Lightweight down jacket',
    price: '¥329',
    img: photo('carousel-web-product-cards-1', 400, 300),
  },
  {
    id: 2,
    name: 'Trail hiking shoes',
    price: '¥459',
    img: photo('carousel-web-product-cards-2', 400, 300),
  },
  {
    id: 3,
    name: 'Camping folding chair',
    price: '¥129',
    img: photo('carousel-web-product-cards-3', 400, 300),
  },
  {
    id: 4,
    name: 'Titanium water cup',
    price: '¥199',
    img: photo('carousel-web-product-cards-4', 400, 300),
  },
  {
    id: 5,
    name: 'Outdoor backpack',
    price: '¥289',
    img: photo('carousel-web-product-cards-5', 400, 300),
  },
  {
    id: 6,
    name: 'Quick-dry sun hoodie',
    price: '¥159',
    img: photo('carousel-web-product-cards-6', 400, 300),
  },
  {
    id: 7,
    name: 'Camp headlamp',
    price: '¥89',
    img: photo('carousel-web-product-cards-7', 400, 300),
  },
  {
    id: 8,
    name: 'Portable charcoal grill',
    price: '¥349',
    img: photo('carousel-web-product-cards-8', 400, 300),
  },
];
</script>

<template>
  <SnCarousel
    draggable
    loop
    :slides-per-view="3"
    :space-between="16"
    show-arrow
    style="height: 240px"
  >
    <SnCarouselItem v-for="p in products" :key="p.id">
      <div class="product-card">
        <img class="product-img" :src="p.img" :alt="p.name" />
        <div class="product-name">{{ p.name }}</div>
        <div class="product-price">{{ p.price }}</div>
      </div>
    </SnCarouselItem>
  </SnCarousel>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--sn-web-color-border);
  border-radius: 8px;
  background: var(--sn-web-color-background-surface);
  overflow: hidden;
}
.product-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}
.product-name {
  flex: 1;
  padding: 10px 12px 0;
  font-size: 14px;
  color: var(--sn-web-color-text-primary);
}
.product-price {
  padding: 4px 12px 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--sn-web-color-action-primary);
}
</style>
