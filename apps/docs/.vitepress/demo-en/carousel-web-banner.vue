<script setup lang="ts">
/** Demo: SnCarousel — marketing banner with title/description captions. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

/** 自包含渐变占位图（SVG data URI），demo 不依赖外网图片源。 */
function ph(from: string, to: string, w = 800, h = 400): string {
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#g)"/>`,
    `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.3}" fill="rgba(255,255,255,0.16)"/>`,
    `<circle cx="${w * 0.2}" cy="${h * 0.82}" r="${h * 0.24}" fill="rgba(255,255,255,0.12)"/>`,
    '</svg>',
  ]
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(parts.join(''))}`
}

const banners = [
  {
    src: ph('#69b1ff', '#0958d9'),
    alt: 'Spring new arrivals',
    title: 'Spring arrivals launch',
    description: 'Sitewide new arrivals at 20% off for a limited time; members earn double points',
  },
  {
    src: ph('#b37feb', '#531dab'),
    alt: 'Travel zone',
    title: 'Travel season · Travel zone',
    description: '¥300 off flight + hotel packages, with flexible cancellation and changes',
  },
  {
    src: ph('#5cdbd3', '#08979c'),
    alt: 'Member Day',
    title: 'Member Day is here',
    description: 'Exclusive coupon pack on the 18th each month — tap to claim now',
  },
]
</script>

<template>
  <SnCarousel
    draggable
    dot-type="line"
    style="height: 280px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem
      v-for="b in banners"
      :key="b.src"
      :title="b.title"
      :description="b.description"
    >
      <img :src="b.src" :alt="b.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
