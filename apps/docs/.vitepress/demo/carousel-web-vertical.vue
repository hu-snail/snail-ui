<script setup lang="ts">
/** Demo: SnCarousel — vertical direction with dots on the right. */
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
  { src: ph('#ffd666', '#d48806', '灯塔', 600, 500), alt: '灯塔' },
  { src: ph('#ff85c0', '#c41d7f', '小狗', 600, 500), alt: '小狗' },
  { src: ph('#d3f261', '#5b8c00', '花田', 600, 500), alt: '花田' },
];
</script>

<template>
  <div class="demo-row">
    <SnCarousel
      draggable
      direction="vertical"
      dot-placement="right"
      style="width: 320px; height: 280px; border-radius: 8px; overflow: hidden"
    >
      <SnCarouselItem v-for="img in images" :key="img.src">
        <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover" />
      </SnCarouselItem>
    </SnCarousel>
    <p class="demo-hint">竖向滚动 + 右侧指示点，滚轮/触摸沿 Y 轴切换。</p>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 24px;
  align-items: center;
}
.demo-hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
