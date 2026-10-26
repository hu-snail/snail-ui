<script setup lang="ts">
/**
 * Demo: SnCarousel — `effect="custom"`: transition control handed to the
 * business. Slides toggle through `v-show` inside a `<Transition>`; pass
 * any Vue `<Transition>` props via `transition-props` and define the
 * matching enter/leave classes yourself.
 */
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
  { src: ph('#69b1ff', '#0958d9', '自定义过渡 01'), alt: '自定义过渡 01' },
  { src: ph('#5cdbd3', '#08979c', '自定义过渡 02'), alt: '自定义过渡 02' },
  { src: ph('#85a5ff', '#1d39c4', '自定义过渡 03'), alt: '自定义过渡 03' },
];
</script>

<template>
  <SnCarousel
    effect="custom"
    show-arrow
    :transition-props="{ name: 'demo-zoom-fade' }"
    style="height: 260px; border-radius: 8px; overflow: hidden"
  >
    <SnCarouselItem v-for="s in slides" :key="s.src">
      <img :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>

<style scoped>
/* transition-props.name = demo-zoom-fade：过渡类作用在 SnCarouselItem 根
 * 元素上（子组件根元素继承本组件 scope id），随 v-show 切换进出。 */
.demo-zoom-fade-enter-active,
.demo-zoom-fade-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}

.demo-zoom-fade-enter-from {
  opacity: 0;
  transform: scale(1.12);
}

.demo-zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
