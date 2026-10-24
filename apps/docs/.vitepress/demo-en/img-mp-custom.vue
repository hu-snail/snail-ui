<script setup lang="ts">
/**
 * Demo: sn-img (uni-end) — custom-class / custom-style / custom-image.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img from its SFC source.
 */
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue'

const demo = 'https://picsum.photos/seed/snui-img-custom/600/400'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnImg
      :src="demo"
      width="100%"
      height="240rpx"
      mode="aspectFill"
      custom-class="sn-img-demo__root"
      custom-style="box-shadow: var(--sn-mp-shadow-md)"
      custom-image="sn-img-demo__image"
    />
    <text class="sn-demo__meta">
      customClass lands on the root &lt;view&gt; (frame / shadow), customStyle is appended to the root inline style and
      customImage lands on the inner &lt;image&gt; (filters / zoom). All three are reached through :deep().
    </text>

    <view class="sn-demo__row">
      <SnImg :src="demo" :width="160" :height="160" mode="aspectFill" custom-image="sn-img-demo__zoom" />
      <SnImg :src="demo" :width="160" :height="160" mode="aspectFill" custom-image="sn-img-demo__fade" />
    </view>
    <text class="sn-demo__meta">One image with two customImage classes: zoomed in and faded out.</text>
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
.sn-demo :deep(.sn-img-demo__root) {
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-lg);
}
.sn-demo :deep(.sn-img-demo__image) {
  border-radius: var(--sn-mp-radius-md);
}
.sn-demo :deep(.sn-img-demo__zoom) {
  transform: scale(1.2);
}
.sn-demo :deep(.sn-img-demo__fade) {
  opacity: 0.6;
}
</style>
