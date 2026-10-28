<script setup lang="ts">
/**
 * Demo: SnCarousel — options 数据驱动的图/视频轮播 + item 插槽自定义。
 * 内置视频无 controls：点击播放/暂停，切走当前帧自动暂停（组件内置）。
 */
import { SnCarousel } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。`seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/** options 模式：type: 'video' 标记视频项，媒体标记由组件内置渲染。 */
const slides = [
  {
    type: 'image' as const,
    src: photo('carousel-web-video-1'),
    alt: '自然纪录片',
    title: '图文专题',
    description: '使用图片与视频混排的内容流',
  },
  {
    type: 'video' as const,
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: photo('carousel-web-video-3', 800, 450),
    title: '宣传视频（点击播放/暂停，切走自动暂停）',
    description: 'Big Buck Bunny 片段 · 无原生工具栏',
  },
  {
    type: 'image' as const,
    src: photo('carousel-web-video-2'),
    alt: '城市旅拍',
    title: '图文专题',
    description: '使用图片与视频混排的内容流',
  },
];

/** item 插槽：完全接管每帧内容（拿到 item / index / isActive 等作用域）。 */
const customSlides = [
  { heading: '自定义内容 A', text: '由 #item 插槽渲染' },
  { heading: '自定义内容 B', text: '内置媒体渲染被整体替换' },
];
</script>

<template>
  <div class="carousel-demo">
    <SnCarousel draggable :options="slides" style="height: 300px; border-radius: 8px; overflow: hidden" />

    <p class="demo-note">↓ #item 插槽覆盖内置媒体渲染</p>

    <SnCarousel :options="customSlides" style="height: 160px; border-radius: 8px; overflow: hidden">
      <template #item="{ item, index, isActive }">
        <div class="custom-slide" :class="{ 'custom-slide--active': isActive }">
          <span class="custom-slide__index">{{ index + 1 }}</span>
          <div>
            <p class="custom-slide__title">{{ item.heading }}</p>
            <p class="custom-slide__text">{{ item.text }}</p>
          </div>
        </div>
      </template>
    </SnCarousel>
  </div>
</template>

<style scoped>
.carousel-demo {
  width: 100%;
}

.demo-note {
  margin: 16px 0 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.custom-slide {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 32px;
  background: linear-gradient(120deg, #eef2ff, #fdf2f8);
  transition: filter 0.3s ease;
}

.custom-slide--active {
  filter: none;
}

.custom-slide__index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-weight: 600;
}

.custom-slide__title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.custom-slide__text {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
