<script setup lang="ts">
/** Demo: SnCarousel — e-commerce product cards, 3 per view with gaps. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const products = [
  { id: 1, name: '轻量羽绒外套', price: '¥329', img: 'https://picsum.photos/id/1080/400/300' },
  { id: 2, name: '山系徒步鞋', price: '¥459', img: 'https://picsum.photos/id/1082/400/300' },
  { id: 3, name: '露营折叠椅', price: '¥129', img: 'https://picsum.photos/id/1084/400/300' },
  { id: 4, name: '钛合金水杯', price: '¥199', img: 'https://picsum.photos/id/1087/400/300' },
  { id: 5, name: '户外双肩包', price: '¥289', img: 'https://picsum.photos/id/1089/400/300' },
  { id: 6, name: '速干防晒衣', price: '¥159', img: 'https://picsum.photos/id/1011/400/300' },
  { id: 7, name: '营地头灯', price: '¥89', img: 'https://picsum.photos/id/1012/400/300' },
  { id: 8, name: '便携烧烤炉', price: '¥349', img: 'https://picsum.photos/id/1013/400/300' },
]
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
        <img class="product-img" :src="p.img" :alt="p.name">
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
