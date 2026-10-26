<script setup lang="ts">
/** Demo: SnCarousel — `mousewheel`: scroll the wheel over the slides to switch. */
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

const slides = [
  { src: ph('#69b1ff', '#0958d9', '01'), alt: 'Slide 1' },
  { src: ph('#5cdbd3', '#08979c', '02'), alt: 'Slide 2' },
  { src: ph('#95de64', '#389e0d', '03'), alt: 'Slide 3' },
  { src: ph('#b37feb', '#531dab', '04'), alt: 'Slide 4' },
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
