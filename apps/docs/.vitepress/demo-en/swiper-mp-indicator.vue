<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — dots / dots-bar / fraction indicators.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const list = [
  'https://picsum.photos/seed/snui-sw-d/750/400',
  'https://picsum.photos/seed/snui-sw-e/750/400',
  'https://picsum.photos/seed/snui-sw-f/750/400',
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper :list="list" :height="260" :indicator="{ type: 'dots' }" />
    <SnSwiper :list="list" :height="260" :indicator="{ type: 'dots-bar' }" />
    <SnSwiper :list="list" :height="260" :indicator="{ type: 'fraction' }" />
    <SnSwiper :list="list" :height="260" :indicator="{ type: 'dots-bar', showControls: true }" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
