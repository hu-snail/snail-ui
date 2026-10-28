<script setup lang="ts">
/**
 * Demo: SnCarousel — video banner mixed with image slides.
 * The `<video>` renders without native controls: click toggles play/pause,
 * and leaving its slide pauses it automatically, so switching slides never
 * leaves audio playing.
 */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

interface Slide {
  type: 'image' | 'video';
  src: string;
  alt: string;
}

const slides: Slide[] = [
  { type: 'image', src: photo('carousel-web-video-1'), alt: '自然纪录片' },
  { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4', alt: '宣传视频' },
  { type: 'image', src: photo('carousel-web-video-2'), alt: '城市旅拍' },
];

const poster = photo('carousel-web-video-3', 800, 450);

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
      :title="s.type === 'video' ? '宣传视频（点击播放/暂停，切走自动暂停）' : '图文专题'"
      :description="
        s.type === 'video' ? 'Big Buck Bunny 片段 · 无原生工具栏' : '使用图片与视频混排的内容流'
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
