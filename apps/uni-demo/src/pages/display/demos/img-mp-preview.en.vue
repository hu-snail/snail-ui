<script setup lang="ts">
/**
 * Demo: sn-img (uni-end) — enable-preview / preview-src / lazy-load / show-menu-by-longpress.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img from its SFC source.
 */
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';

/** The thumbnail and the full-size image opened on tap are different: previewSrc overrides src. */
const thumb = 'https://picsum.photos/seed/snui-img-thumb/300/300';
const full = 'https://picsum.photos/seed/snui-img-full/1400/1400';
const plain = 'https://picsum.photos/seed/snui-img-plain/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnImg
        :src="thumb"
        :preview-src="full"
        enable-preview
        :width="200"
        :height="200"
        radius="16"
        mode="aspectFill"
      />
      <SnImg :src="plain" enable-preview :width="200" :height="200" radius="16" mode="aspectFill" />
    </view>
    <text class="sn-demo__meta">
      Left: enable-preview + preview-src opens the large image that previewSrc points at; right:
      enable-preview alone opens src itself. Where the host has no uni.previewImage (the docs
      preview, for instance) a tap only emits click.
    </text>

    <SnImg
      :src="plain"
      lazy-load
      show-menu-by-longpress
      :width="'100%'"
      height="240rpx"
      mode="aspectFill"
      radius="24"
    />
    <text class="sn-demo__meta">
      lazy-load is handed to the native &lt;image lazy-load&gt;; show-menu-by-longpress opens the
      miniprogram QR menu on long press (WeChat only).
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
