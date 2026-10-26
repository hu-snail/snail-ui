<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — video items degrade to an image + the video props.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/**
 * An item with `type: 'video'` degrades to an image on the uni end (see the
 * component header: `<video>` cannot be driven reliably from a cross-end
 * carousel). The component resolves `src` from the `valueKey` field first
 * (default `value`), so the poster URL is written into `value` here — in a real
 * app `value` would hold the video URL.
 */
const list = [
  {
    type: 'video' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd1/750/400',
    poster: 'https://picsum.photos/seed/snui-sw-vd1/750/400',
    text: 'Video item 1 · renders the poster',
  },
  {
    type: 'video' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd2/750/400',
    poster: 'https://picsum.photos/seed/snui-sw-vd2/750/400',
    text: 'Video item 2 · renders the poster',
  },
  {
    type: 'image' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd3/750/400',
    text: 'Plain image item',
  },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper
      :list="list"
      :height="280"
      autoplay-video
      muted
      video-loop
      stop-previous-video
      stop-autoplay-when-video-play
      :interval="4000"
    />
    <text class="sn-demo__meta">
      autoplay-video / muted / video-loop / stop-previous-video / stop-autoplay-when-video-play are
      declared for reference-API parity; in this build every video item degrades to its poster
      image, so the switches do not change the picture.
    </text>

    <SnSwiper :list="list" :height="240" :autoplay="false" :indicator="{ type: 'fraction' }" />
    <text class="sn-demo__meta"
      >Same data with autoplay off and a fraction indicator to inspect all three slides.</text
    >
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
</style>
