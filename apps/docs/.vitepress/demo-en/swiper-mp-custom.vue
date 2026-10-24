<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — radius plus the custom* class / style hooks.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const list = [
  { value: 'https://picsum.photos/seed/snui-sw-c1/750/400', text: 'Slide 1 · custom classes' },
  { value: 'https://picsum.photos/seed/snui-sw-c2/750/400', text: 'Slide 2 · custom caption style' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper
      :list="list"
      :height="260"
      :radius="32"
      custom-class="sn-swiper-demo__root"
      custom-style="box-shadow: var(--sn-mp-shadow-md)"
      custom-indicator-class="sn-swiper-demo__indicator"
      custom-item-class="sn-swiper-demo__item"
      custom-image-class="sn-swiper-demo__image"
      custom-text-class="sn-swiper-demo__text"
      custom-text-style="letter-spacing: 2rpx"
      custom-prev-class="sn-swiper-demo__prev"
      custom-next-class="sn-swiper-demo__next"
      custom-prev-image-class="sn-swiper-demo__prev-image"
      custom-next-image-class="sn-swiper-demo__next-image"
    />
    <text class="sn-demo__meta">
      radius=32 (rpx) corners; customClass / customStyle land on the root, customItemClass on each swiper-item,
      customImageClass is forwarded to sn-img, customTextClass / customTextStyle style the caption and
      customIndicatorClass styles the indicator node.
    </text>
    <text class="sn-demo__meta">
      customPrevClass / customNextClass / customPrevImageClass / customNextImageClass are declared for reference-API
      parity: this build renders no prev / next peek slides, so nothing consumes them yet.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
/* These classes are attached to the component's inner nodes by the custom-* props. */
.sn-demo :deep(.sn-swiper-demo__root) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
.sn-demo :deep(.sn-swiper-demo__indicator) {
  background-color: var(--sn-mp-color-background-overlay);
  border-radius: var(--sn-mp-radius-full);
}
.sn-demo :deep(.sn-swiper-demo__item) {
  padding: 0 var(--sn-mp-spacing-1);
}
.sn-demo :deep(.sn-swiper-demo__image) {
  border-radius: var(--sn-mp-radius-md);
}
.sn-demo :deep(.sn-swiper-demo__text) {
  font-weight: var(--sn-mp-font-weight-semibold);
}
</style>
