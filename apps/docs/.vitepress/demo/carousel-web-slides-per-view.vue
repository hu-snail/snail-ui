<script setup lang="ts">
/** Demo: SnCarousel — slides-per-view with space-between and no loop. */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/** 自包含渐变占位图（SVG data URI），demo 不依赖外网图片源。 */
function ph(from: string, to: string, label = '', w = 800, h = 400): string {
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#g)"/>`,
    `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.3}" fill="rgba(255,255,255,0.16)"/>`,
    `<circle cx="${w * 0.2}" cy="${h * 0.82}" r="${h * 0.24}" fill="rgba(255,255,255,0.12)"/>`,
  ];
  if (label) {
    parts.push(
      `<text x="50%" y="52%" fill="rgba(255,255,255,0.92)" font-family="system-ui,sans-serif" font-size="${Math.round(h * 0.13)}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${label}</text>`,
    );
  }
  parts.push('</svg>');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(parts.join(''))}`;
}

const images = [
  { src: ph('#ff85c0', '#c41d7f', '草莓', 400, 300), alt: '草莓' },
  { src: ph('#85a5ff', '#1d39c4', '北极熊', 400, 300), alt: '北极熊' },
  { src: ph('#5cdbd3', '#08979c', '海象', 400, 300), alt: '海象' },
  { src: ph('#69b1ff', '#0958d9', '海岛', 400, 300), alt: '海岛' },
  { src: ph('#b37feb', '#531dab', '花', 400, 300), alt: '花' },
];
</script>

<template>
  <SnCarousel
    draggable
    :slides-per-view="3"
    :space-between="12"
    :loop="false"
    show-arrow
    style="height: 200px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="img in images" :key="img.src">
      <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
