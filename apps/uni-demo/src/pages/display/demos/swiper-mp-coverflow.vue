<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow 两侧露出（AUI-additive）。
 * 露出宽度由 previous-margin / next-margin 控制；非激活卡片缩小由 coverflow-scale 控制。
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** 6 张演示图（picsum 按种子稳定取图）。 */
const slides = [1, 2, 3, 4, 5, 6].map((n) => ({
  value: `https://picsum.photos/seed/snui-coverflow-${n}/600/400`,
  text: `卡片 ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · 默认露出（80rpx）</text>
      <SnSwiper :list="slides" coverflow height="360rpx" radius="24rpx" autoplay />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · 自定义露出宽度（previous/next-margin=120rpx）+ 缩放 0.8</text>
      <SnSwiper
        :list="slides"
        coverflow
        :coverflow-scale="0.8"
        previous-margin="120rpx"
        next-margin="120rpx"
        height="360rpx"
        radius="24rpx"
        :indicator="{ type: 'scale' }"
      />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">Coverflow · scale 指示器 + 左右箭头</text>
      <SnSwiper
        :list="slides"
        coverflow
        height="360rpx"
        radius="24rpx"
        :indicator="{ type: 'scale', showControls: true }"
      />
    </view>

    <view class="sn-demo__block">
      <text class="sn-demo__label">普通模式（对照，无 coverflow）</text>
      <SnSwiper :list="slides" height="360rpx" radius="24rpx" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-demo__block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
