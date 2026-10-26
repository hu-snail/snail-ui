<script setup lang="ts">
/**
 * Demo: SnCarousel — video banner mixed with image slides.
 * The `<video>` renders without native controls: click toggles play/pause,
 * and leaving its slide pauses it automatically, so switching slides never
 * leaves audio playing.
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

interface Slide {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

const slides: Slide[] = [
  { type: 'image', src: ph('#69b1ff', '#0958d9', 'Nature documentary'), alt: 'Nature documentary' },
  { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', alt: 'Promo video' },
  { type: 'image', src: ph('#5cdbd3', '#08979c', 'City photo walk'), alt: 'City photo walk' },
];

const poster = ph('#85a5ff', '#1d39c4', '', 800, 450);

/** 无 controls 工具栏：点击视频播放/暂停（切走当前帧时组件自动 pause）。 */
function toggleVideo(event: MouseEvent): void {
  const video = event.currentTarget as HTMLVideoElement | null;
  if (!video) return;
  if (video.paused) void video.play();
  else video.pause();
}
</script>

<template>
  <SnCarousel draggable style="height: 300px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem
      v-for="s in slides"
      :key="s.src"
      :title="
        s.type === 'video'
          ? 'Promo video (click to play/pause; auto-pauses when switched away)'
          : 'Photo story'
      "
      :description="
        s.type === 'video'
          ? 'Big Buck Bunny clip · no native toolbar'
          : 'A content stream mixing images and videos'
      "
    >
      <video
        v-if="s.type === 'video'"
        :src="s.src"
        :poster="poster"
        muted
        loop
        playsinline
        preload="metadata"
        style="width: 100%; height: 100%; object-fit: cover; display: block; cursor: pointer"
        @click="toggleVideo"
      />
      <img v-else :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover" />
    </SnCarouselItem>
  </SnCarousel>
</template>
