<script setup lang="ts">
/**
 * Demo: sn-image-preview (uni-end) — selector 命中区 / loop / closeable / close-on-click / z-index / 长按。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-image-preview from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnImagePreview from '@snui/uni-src/components/sn-image-preview/sn-image-preview.vue'
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue'

const preview = ref<{
  open: (options?: { images?: string[]; startPosition?: number }) => void
  close: () => void
  setActive: (index: number) => void
} | null>(null)

const images = [
  '/demo/snui-photo-1.jpg',
  '/demo/snui-photo-2.jpg',
  '/demo/snui-photo-3.jpg',
]

const lastEvent = ref('—')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      selector 模式：下面的缩略图都带 `sn-demo__thumb` 类，`selector=".sn-demo__thumb"` 会在 open() 时用
      uni.createSelectorQuery 取它们的盒子并铺透明点击区。宿主没有该能力（文档预览 / 单测）时不生成点击区，
      open() 仍然可用，此时请用按钮打开。
    </text>

    <view class="sn-demo__thumbs">
      <view v-for="(image, index) in images" :key="image" class="sn-demo__thumb">
        <SnImg :src="image" :width="150" :height="150" mode="aspectFill" radius="8" />
      </view>
    </view>

    <view class="sn-demo__row">
      <SnButton size="small" @tap="preview?.open({ startPosition: 0 })">从第一张打开</SnButton>
      <SnButton size="small" @tap="preview?.open({ startPosition: 2 })">从第三张打开</SnButton>
    </view>
    <text class="sn-demo__meta">最近事件：{{ lastEvent }}</text>

    <SnImagePreview
      ref="preview"
      selector=".sn-demo__thumb"
      :images="images"
      :start-position="1"
      :loop="false"
      :closeable="false"
      :close-on-click="false"
      show-menu-by-longpress
      :z-index="1200"
      custom-class="sn-demo-contained"
      @open="lastEvent = 'open'"
      @close="lastEvent = 'close'"
      @long-press="(payload: { image: string }) => (lastEvent = `long-press → ${payload.image.slice(-12)}`)"
    >
      <template #default>
        <view class="sn-demo__footer">
          <SnButton size="small" @tap="preview?.close()">关闭</SnButton>
        </view>
      </template>
    </SnImagePreview>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__thumbs {
  display: flex;
  gap: 12rpx;
}
.sn-demo__thumb {
  overflow: hidden;
  border-radius: 8rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-demo__footer {
  display: flex;
  justify-content: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only: the viewer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-image-preview.sn-demo-contained {
  position: absolute;
}
</style>
