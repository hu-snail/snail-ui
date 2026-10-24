<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — display-multiple-items + peek margins + snap-to-edge.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const list = [
  'https://picsum.photos/seed/snui-sw-m1/750/400',
  'https://picsum.photos/seed/snui-sw-m2/750/400',
  'https://picsum.photos/seed/snui-sw-m3/750/400',
  'https://picsum.photos/seed/snui-sw-m4/750/400',
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper :list="list" :height="240" :display-multiple-items="2" :autoplay="false" />
    <text class="sn-demo__meta">display-multiple-items=2：同屏两张，索引按整组推进。</text>

    <SnSwiper
      :list="list"
      :height="220"
      :previous-margin="60"
      :next-margin="60"
      :autoplay="false"
    />
    <text class="sn-demo__meta">previous-margin / next-margin = 60rpx：左右露出相邻张的边角。</text>

    <SnSwiper
      :list="list"
      :height="220"
      :previous-margin="60"
      :next-margin="60"
      snap-to-edge
      :autoplay="false"
    />
    <text class="sn-demo__meta">snap-to-edge：首尾张也会对齐到边距，不留空白。</text>
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
