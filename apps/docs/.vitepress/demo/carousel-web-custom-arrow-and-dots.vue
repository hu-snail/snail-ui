<script setup lang="ts">
/** Demo: SnCarousel — custom arrow + dots via scoped slots. */
import { ref } from 'vue'
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

/** 自包含渐变占位图（SVG data URI），demo 不依赖外网图片源。 */
function ph(from: string, to: string, label = '', w = 800, h = 400): string {
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#g)"/>`,
    `<circle cx="${w * 0.78}" cy="${h * 0.28}" r="${h * 0.3}" fill="rgba(255,255,255,0.16)"/>`,
    `<circle cx="${w * 0.2}" cy="${h * 0.82}" r="${h * 0.24}" fill="rgba(255,255,255,0.12)"/>`,
  ]
  if (label) {
    parts.push(`<text x="50%" y="52%" fill="rgba(255,255,255,0.92)" font-family="system-ui,sans-serif" font-size="${Math.round(h * 0.13)}" font-weight="600" text-anchor="middle" dominant-baseline="middle">${label}</text>`)
  }
  parts.push('</svg>')
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(parts.join(''))}`
}

const images = [
  { src: ph('#69b1ff', '#0958d9', '湖泊小舟'), alt: '湖泊小舟' },
  { src: ph('#95de64', '#389e0d', '山丘'), alt: '山丘' },
  { src: ph('#5cdbd3', '#08979c', '雾林'), alt: '雾林' },
  { src: ph('#ff9c6e', '#d4380d', '岩石海岸'), alt: '岩石海岸' },
]

const current = ref(0)
</script>

<template>
  <div class="custom-carousel">
    <SnCarousel
      draggable
      v-model:current-index="current"
      style="height: 240px; border-radius: 8px; overflow: hidden"
    >
      <SnCarouselItem v-for="img in images" :key="img.src">
        <img :src="img.src" :alt="img.alt" style="width: 100%; height: 100%; object-fit: cover">
      </SnCarouselItem>

      <template #arrow="{ prev, next, isPrevDisabled, isNextDisabled }">
        <button
          type="button"
          class="nav-btn nav-btn--left"
          :disabled="isPrevDisabled()"
          aria-label="上一张"
          @click="prev()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M10.26 3.2a.75.75 0 0 1 .04 1.06L6.773 8l3.527 3.74a.75.75 0 1 1-1.1 1.02l-4-4.25a.75.75 0 0 1 0-1.02l4-4.25a.75.75 0 0 1 1.06-.04z" fill="currentColor" />
          </svg>
        </button>
        <button
          type="button"
          class="nav-btn nav-btn--right"
          :disabled="isNextDisabled()"
          aria-label="下一张"
          @click="next()"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M5.74 3.2a.75.75 0 0 0-.04 1.06L9.227 8L5.7 11.74a.75.75 0 1 0 1.1 1.02l4-4.25a.75.75 0 0 0 0-1.02l-4-4.25a.75.75 0 0 0-1.06-.04z" fill="currentColor" />
          </svg>
        </button>
      </template>

      <template #dots="{ total, currentIndex, to }">
        <div class="custom-dots">
          <button
            v-for="i in total"
            :key="i"
            type="button"
            class="custom-dot"
            :class="{ 'custom-dot--active': currentIndex === i - 1 }"
            @click="to(i - 1)"
          >
            {{ i - 1 }}
          </button>
        </div>
      </template>
    </SnCarousel>
    <p class="demo-hint">当前第 {{ current + 1 }} / {{ images.length }} 张（v-model:current-index）</p>
  </div>
</template>

<style scoped>
.custom-carousel {
  position: relative;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-primary);
  cursor: pointer;
}
.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.nav-btn--left {
  left: 12px;
}
.nav-btn--right {
  right: 12px;
}

.custom-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.custom-dot {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border: none;
  border-radius: 11px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font-size: 12px;
  cursor: pointer;
}
.custom-dot--active {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-inverse, #fff);
}

.demo-hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
