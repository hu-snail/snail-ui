<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow 两侧露出 + scale 指示器（AUI-additive）。
 * 中央全尺寸圆角卡，两侧卡片经 previous/next-margin 露出并按 coverflow-scale 缩小，
 * 切换由 400ms ease-out transform 过渡；字幕为弥散阴影 scrim，非黑块。
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** 露出效果演示（picsum 按种子稳定取图）。 */
const peekSlides = [
  { value: 'https://picsum.photos/seed/snui-peek-1/640/420', text: '北欧绿植美学空间' },
  { value: 'https://picsum.photos/seed/snui-peek-2/640/420', text: '地中海夏日光影' },
  { value: 'https://picsum.photos/seed/snui-peek-3/640/420', text: '晨光采光' },
  { value: 'https://picsum.photos/seed/snui-peek-4/640/420', text: '暮色度假光影' },
  { value: 'https://picsum.photos/seed/snui-peek-5/640/420', text: '焕灯光影' },
];

/** 景深层叠演示（更低 coverflow-scale，层叠感更强）。 */
const scaleSlides = [1, 2, 3, 4].map((n) => ({
  value: `https://picsum.photos/seed/snui-scale-${n}/640/420`,
  text: `微动效设计 ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 卡片距离露出：120rpx 露出 + scale 点串 + 双侧箭头 -->
    <SnSwiper
      :list="peekSlides"
      coverflow
      previous-margin="120rpx"
      next-margin="120rpx"
      height="400rpx"
      radius="24rpx"
      :indicator="{ type: 'scale', showControls: true }"
      indicator-position="bottom"
    />

    <!-- 景深层叠：coverflowScale=0.78，非激活卡更小；默认 80rpx 露出 -->
    <SnSwiper
      :list="scaleSlides"
      coverflow
      :coverflow-scale="0.78"
      height="400rpx"
      radius="24rpx"
      autoplay
      :indicator="{ type: 'scale', showControls: true }"
    />

    <!-- 纯图片无字幕对照 -->
    <SnSwiper
      :list="peekSlides.map((s) => s.value)"
      coverflow
      height="400rpx"
      radius="24rpx"
      :indicator="false"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
