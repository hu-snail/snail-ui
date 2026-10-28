<script setup lang="ts">
/**
 * Demo: SnCarousel — `effect="custom"`: transition control handed to the
 * business. Slides toggle through `v-show` inside a `<Transition>`; pass
 * any Vue `<Transition>` props via `transition-props` and define the
 * matching enter/leave classes yourself.
 */
import { SnCarousel, SnCarouselItem } from '@snui/vue-web';

/**
 * 演示用网络图片（picsum.photos）。真实照片比渐变占位更能体现轮播的过渡与裁切效果；
 * `seed` 固定则同一张图稳定复现，便于 demo 长期一致。
 */
function photo(seed: string, w = 800, h = 400): string {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const slides = [
  { src: photo('carousel-web-effect-custom-1'), alt: 'Custom transition 01' },
  { src: photo('carousel-web-effect-custom-2'), alt: 'Custom transition 02' },
  { src: photo('carousel-web-effect-custom-3'), alt: 'Custom transition 03' },
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
