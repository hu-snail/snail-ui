<script setup lang="ts">
/**
 * Demo: sn-swiper (uni-end) — coverflow 两侧露出 + scale 指示器（AUI-additive）。
 * 对齐设计稿「卡片模式与露出效果」：中央全尺寸圆角卡，两侧卡片经
 * previous/next-margin 露出并缩小；露头宽度 = previous/next-margin，缩放 = coverflow-scale。
 */
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';

/** 露出效果演示（picsum 按种子稳定取图）。 */
const peekSlides = [
  { value: 'https://picsum.photos/seed/snui-peek-1/640/420', text: '焕灯光影' },
  { value: 'https://picsum.photos/seed/snui-peek-2/640/420', text: '晨光采光' },
  { value: 'https://picsum.photos/seed/snui-peek-3/640/420', text: '北欧绿植美学空间' },
  { value: 'https://picsum.photos/seed/snui-peek-4/640/420', text: '地中海夏日光影' },
  { value: 'https://picsum.photos/seed/snui-peek-5/640/420', text: '暮色度假光影' },
];

/** 缩放 / 层叠演示（更大偏移 + 更低 scale，远卡更明显）。 */
const scaleSlides = [1, 2, 3, 4].map((n) => ({
  value: `https://picsum.photos/seed/snui-scale-${n}/640/420`,
  text: `微动效设计 ${n}`,
}));
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">卡片距离露出 (Peeking Cards)</text>
        <text class="sn-demo__tag">前后留白露出</text>
      </view>
      <!-- 露出宽度 = previous/next-margin（本例 120rpx）；scale 指示器 + 箭头居中下方 -->
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
    </view>

    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">3D 卡片缩放 / 层叠 (Scale Effect)</text>
        <text class="sn-demo__tag">景深层叠</text>
      </view>
      <!-- coverflowScale=0.78：非激活卡更小，层叠感更强；默认 80rpx 露出 -->
      <SnSwiper
        :list="scaleSlides"
        coverflow
        :coverflow-scale="0.78"
        height="400rpx"
        radius="24rpx"
        autoplay
        :indicator="{ type: 'scale', showControls: true }"
      />
    </view>

    <view class="sn-demo__block">
      <view class="sn-demo__head">
        <text class="sn-demo__title">普通模式 (Flat 对照)</text>
        <text class="sn-demo__tag">无 coverflow</text>
      </view>
      <SnSwiper :list="peekSlides" height="400rpx" radius="24rpx" />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.sn-demo__block {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-demo__head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.sn-demo__title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__tag {
  font-size: 22rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
