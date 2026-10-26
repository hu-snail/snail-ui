<script setup lang="ts">
/** Demo: SnCarousel — e-commerce product cards, 3 per view with gaps. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/** 自包含渐变占位图（SVG data URI），demo 不依赖外网图片源。 */
function ph(from: string, to: string, w = 800, h = 400): string {
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#g)"/>`,
    `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.3}" fill="rgba(255,255,255,0.16)"/>`,
    `<circle cx="${w * 0.2}" cy="${h * 0.82}" r="${h * 0.24}" fill="rgba(255,255,255,0.12)"/>`,
    '</svg>',
  ];
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(parts.join(''))}`;
}

const products = [
  { id: 1, name: '轻量羽绒外套', price: '¥329', img: ph('#69b1ff', '#0958d9', 400, 300) },
  { id: 2, name: '山系徒步鞋', price: '¥459', img: ph('#5cdbd3', '#08979c', 400, 300) },
  { id: 3, name: '露营折叠椅', price: '¥129', img: ph('#95de64', '#389e0d', 400, 300) },
  { id: 4, name: '钛合金水杯', price: '¥199', img: ph('#ffd666', '#d48806', 400, 300) },
  { id: 5, name: '户外双肩包', price: '¥289', img: ph('#ff85c0', '#c41d7f', 400, 300) },
  { id: 6, name: '速干防晒衣', price: '¥159', img: ph('#85a5ff', '#1d39c4', 400, 300) },
  { id: 7, name: '营地头灯', price: '¥89', img: ph('#ff9c6e', '#d4380d', 400, 300) },
  { id: 8, name: '便携烧烤炉', price: '¥349', img: ph('#b37feb', '#531dab', 400, 300) },
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
