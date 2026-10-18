<script setup lang="ts">
/**
 * Demo: SnCarousel — video banner mixed with image slides.
 * The `<video>` uses native controls; leaving its slide pauses it
 * automatically, so switching slides never leaves audio playing.
 */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web'

const slides = [
  { type: 'image', src: 'https://picsum.photos/id/1035/800/450', alt: '自然纪录片' },
  { type: 'video', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { type: 'image', src: 'https://picsum.photos/id/1039/800/450', alt: '城市旅拍' },
] as const
</script>

<template>
  <SnCarousel draggable style="height: 300px; border-radius: 8px; overflow: hidden">
    <SnCarouselItem
      v-for="s in slides"
      :key="s.src"
      :title="s.type === 'video' ? '宣传视频（可拖拽切换，自动暂停）' : '图文专题'"
      :description="s.type === 'video' ? 'Big Buck Bunny 片段，演示视频轮播' : '使用图片与视频混排的内容流'"
    >
      <video
        v-if="s.type === 'video'"
        :src="s.src"
        poster="https://picsum.photos/id/1084/800/450"
        controls
        muted
        style="width: 100%; height: 100%; object-fit: cover; display: block"
      />
      <img v-else :src="s.src" :alt="s.alt" style="width: 100%; height: 100%; object-fit: cover">
    </SnCarouselItem>
  </SnCarousel>
</template>
