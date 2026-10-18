<script setup lang="ts">
/**
 * SnCarouselItem — one slide of SnCarousel.
 *
 * Reference library: naive-ui `n-carousel-item`
 *   (https://github.com/tusen-ai/naive-ui/blob/main/src/carousel/src/CarouselItem.tsx)
 * Per AGENTS.md §112, markup + semantics mirror n-carousel-item 1:1:
 *   `role="option"` slide element with `--current` / `--prev` / `--next`
 *   state classes, `data-index`, `aria-hidden`, and a capture-phase click
 *   forwarded to the carousel (card-mode navigation + drag suppression).
 *
 * The item does not own any state: it registers its root element with the
 * parent SnCarousel through provide/inject (mirrors naive
 * CarouselContext.addSlide/removeSlide) and derives its index and style
 * from the parent. Inline style comes from `getSlideStyle` — slide effect
 * sizing/margins for `slides-per-view` + `space-between`, transition
 * timing for fade/card, and prev/next-slide-style overrides in card mode.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only.
 *
 * Usage:
 *   <SnCarousel>
 *     <SnCarouselItem>…</SnCarouselItem>
 *   </SnCarousel>
 */

import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { carouselContextKey } from './SnCarousel.vue'
import type { SnCarouselContext } from './SnCarousel.vue'

defineOptions({ name: 'SnCarouselItem' })

function useCarouselContextOrThrow(): SnCarouselContext {
  const ctx = inject(carouselContextKey)
  if (!ctx) {
    // naive `useCarouselContext` throws the same way.
    throw new Error('[snui] `sn-carousel-item` must be placed inside `sn-carousel`.')
  }
  return ctx
}

const context: SnCarouselContext = useCarouselContextOrThrow()

const selfElRef = ref<HTMLElement | null>(null)

/** Real index of this slide within the (possibly clone-extended) list. */
const index = computed<number>(() => {
  const el = selfElRef.value
  return el ? context.getSlideIndex(el) : -1
})

const isPrev = computed<boolean>(() => context.isPrev(index.value))
const isNext = computed<boolean>(() => context.isNext(index.value))
const isActive = computed<boolean>(() => context.isActive(index.value))
const style = computed(() => context.getSlideStyle(index.value))

onMounted(() => {
  context.addSlide(selfElRef.value ?? undefined)
})

onBeforeUnmount(() => {
  context.removeSlide(selfElRef.value ?? undefined)
})

function handleClick(event: MouseEvent): void {
  context.onCarouselItemClick(index.value, event)
}
</script>

<template>
  <div
    ref="selfElRef"
    :class="[
      'sn-carousel__slide',
      isActive ? 'sn-carousel__slide--current' : '',
      isPrev ? 'sn-carousel__slide--prev' : '',
      isNext ? 'sn-carousel__slide--next' : '',
    ]"
    role="option"
    tabindex="-1"
    :data-index="index"
    :aria-hidden="!isActive"
    :style="style"
    @click.capture="handleClick"
  >
    <slot :is-prev="isPrev" :is-next="isNext" :is-active="isActive" :index="index" />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only.
 * Slide-box rules mirror naive `carousel.cssr` `cE('slide')` block plus the
 * effect (fade/card) state modifiers. Rules targeting the slides container
 * (`__slides`) live in SnCarousel.vue — scoped styles only attach the data
 * attribute to this component's own elements. */

.sn-carousel__slide {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
}

.sn-carousel__slide > :deep(img) {
  display: block;
}

/* ── effect: fade — absolute stack, opacity swap ── */
.sn-carousel--fade .sn-carousel__slide {
  position: absolute;
  opacity: 0;
  transition-property: opacity;
  pointer-events: none;
}
.sn-carousel--fade .sn-carousel__slide--current {
  opacity: 1;
  pointer-events: auto;
}

/* ── effect: card — 3D offsets relative to the current slide ──
 * Perspective (on `__slides`) is defined in SnCarousel.vue. */
.sn-carousel--card .sn-carousel__slide {
  position: absolute;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%) translateZ(-400px);
  transition-property: opacity, transform;
}
.sn-carousel--card .sn-carousel__slide--current {
  opacity: 1;
  transform: translateX(-50%) translateZ(0);
  z-index: 1;
}
.sn-carousel--card .sn-carousel__slide--prev {
  opacity: 0.4;
  transform: translateX(-100%) translateZ(-200px);
}
.sn-carousel--card .sn-carousel__slide--next {
  opacity: 0.4;
  transform: translateX(0%) translateZ(-200px);
}

/* ── direction: vertical — recenter the absolute fade/card stack ── */
.sn-carousel--vertical.sn-carousel--fade .sn-carousel__slide {
  top: 50%;
  left: unset;
  transform: translateY(-50%);
}
.sn-carousel--vertical.sn-carousel--card .sn-carousel__slide {
  top: 50%;
  left: unset;
  transform: translateY(-50%) translateZ(-400px);
}
.sn-carousel--vertical.sn-carousel--card .sn-carousel__slide--current {
  transform: translateY(-50%) translateZ(0);
}
.sn-carousel--vertical.sn-carousel--card .sn-carousel__slide--prev {
  transform: translateY(-100%) translateZ(-200px);
}
.sn-carousel--vertical.sn-carousel--card .sn-carousel__slide--next {
  transform: translateY(0%) translateZ(-200px);
}
</style>
