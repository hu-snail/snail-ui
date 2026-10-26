<script setup lang="ts">
/**
 * Demo: sn-watermark (uni-end) — 图片瓦片 / 字体族 / z-index / custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-watermark from its SFC source.
 */
import SnWatermark from '@snui/uni-src/components/sn-watermark/sn-watermark.vue';

const logo = 'https://picsum.photos/seed/snui-wm-logo/200/200';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-watermark-demo__stage">
      <SnWatermark
        :image="logo"
        :image-width="90"
        :image-height="90"
        :full-screen="false"
        :opacity="0.25"
      />
      <view class="sn-watermark-demo__card">
        <text class="sn-watermark-demo__title">图片水印瓦片</text>
        <text class="sn-watermark-demo__body"
          >image 优先于 content，瓦片尺寸由 imageWidth / imageHeight 决定。</text
        >
      </view>
    </view>

    <view class="sn-watermark-demo__stage">
      <SnWatermark
        content="字体族 / 样式 / z-index"
        :full-screen="false"
        font-family="serif"
        font-style="italic"
        font-weight="700"
        :size="16"
        :z-index="5"
        :opacity="0.4"
        custom-class="sn-watermark-demo__custom"
        custom-style="border-radius: 8rpx"
      />
      <view class="sn-watermark-demo__card">
        <text class="sn-watermark-demo__title">文字水印的字体控制</text>
        <text class="sn-watermark-demo__body">
          fontFamily / fontStyle / fontWeight 作用在渲染出的 text 上；zIndex 与 customStyle
          作用在根节点。
        </text>
      </view>
    </view>

    <text class="sn-demo__meta">
      水印层 pointer-events: none，不拦截点击；customClass 挂根节点，customStyle 追加到根节点 inline
      style。
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
.sn-watermark-demo__stage {
  position: relative;
  width: 100%;
  height: 280rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-surface);
}
.sn-watermark-demo__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 32rpx;
}
.sn-watermark-demo__title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.sn-watermark-demo__body {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo :deep(.sn-watermark-demo__custom) {
  border: 2rpx dashed var(--sn-mp-color-border-subtle);
}
</style>
