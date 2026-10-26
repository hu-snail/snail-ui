<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — 视频项的降级渲染 + 视频类 props（仅对齐参考 API）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-swiper from its SFC source.
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/**
 * `type: 'video'` 的项在 uni 端退化成渲染图片（见组件文件头：`<video>` 无法在跨端
 * 轮播里可靠驱动）。组件的 `src` 解析优先取 `valueKey` 字段（默认 `value`），因此这里
 * 把海报地址同时写进 `value` —— 真实项目里 `value` 会是视频地址。
 */
const list = [
  {
    type: 'video' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd1/750/400',
    poster: 'https://picsum.photos/seed/snui-sw-vd1/750/400',
    text: '视频项 1 · 渲染海报',
  },
  {
    type: 'video' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd2/750/400',
    poster: 'https://picsum.photos/seed/snui-sw-vd2/750/400',
    text: '视频项 2 · 渲染海报',
  },
  {
    type: 'image' as const,
    value: 'https://picsum.photos/seed/snui-sw-vd3/750/400',
    text: '普通图片项',
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
      autoplay-video / muted / video-loop / stop-previous-video / stop-autoplay-when-video-play
      为参考 API 对齐而声明， 当前实现下视频项统一降级为海报图片，因此这些开关不改变画面。
    </text>

    <SnSwiper :list="list" :height="240" :autoplay="false" :indicator="{ type: 'fraction' }" />
    <text class="sn-demo__meta">同一份数据关闭 autoplay，并改用分式指示器查看三张内容。</text>
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
