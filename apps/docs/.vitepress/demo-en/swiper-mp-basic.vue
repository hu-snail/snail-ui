<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — autoplay carousel with captions.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import { ref } from 'vue'
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const current = ref(0)

const list = [
  { value: 'https://picsum.photos/seed/snui-sw-a/750/400', text: 'Slide 1 · image carousel' },
  { value: 'https://picsum.photos/seed/snui-sw-b/750/400', text: 'Slide 2 · autoplay enabled' },
  { value: 'https://picsum.photos/seed/snui-sw-c/750/400', text: 'Slide 3 · loops forever' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper v-model:current="current" :list="list" :height="320" />
    <text class="sn-swiper-demo__meta">Showing {{ current + 1 }} / {{ list.length }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-swiper-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
