<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — direction=vertical + adjust-height（支付宝小程序生效）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue'

const list = [
  { value: 'https://picsum.photos/seed/snui-sw-v1/750/400', text: '竖向第 1 屏' },
  { value: 'https://picsum.photos/seed/snui-sw-v2/750/400', text: '竖向第 2 屏' },
  { value: 'https://picsum.photos/seed/snui-sw-v3/750/400', text: '竖向第 3 屏' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSwiper :list="list" :height="300" direction="vertical" :interval="3000" />
    <text class="sn-demo__meta">direction="vertical"：上下滑动，指示器仍在底部居中。</text>

    <SnSwiper
      :list="list"
      height="360rpx"
      direction="vertical"
      adjust-height="current"
      adjust-vertical-height
      :autoplay="false"
    />
    <text class="sn-demo__meta">
      height 传字符串（360rpx）+ adjust-height="current" + adjust-vertical-height：仅支付宝小程序读取，其余端忽略。
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
</style>
