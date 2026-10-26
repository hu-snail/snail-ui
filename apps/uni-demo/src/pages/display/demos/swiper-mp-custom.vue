<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — radius 与 custom* 类名 / 样式插槽。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

const list = [
  { value: 'https://picsum.photos/seed/snui-sw-c1/750/400', text: '第一张 · 自定义类名' },
  { value: 'https://picsum.photos/seed/snui-sw-c2/750/400', text: '第二张 · 自定义文案样式' },
];
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
      radius=32（rpx）圆角；customClass / customStyle 作用于根节点，customItemClass 作用于每个
      swiper-item， customImageClass 透传给 sn-img，customTextClass / customTextStyle
      作用于文案，customIndicatorClass 作用于指示器。
    </text>
    <text class="sn-demo__meta">
      customPrevClass / customNextClass / customPrevImageClass / customNextImageClass 为参考 API
      对齐而声明： 本实现不渲染前后露出的 peek 滑块，因此这四项暂无消费方。
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
/* 下面这些类由 custom-* props 挂到组件内部节点上，`:deep()` 才能命中。 */
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
