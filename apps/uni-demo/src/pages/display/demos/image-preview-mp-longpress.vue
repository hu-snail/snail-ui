<script setup lang="ts">
/**
 * Demo: sn-image-preview (uni-end) — 长按菜单与事件（showMenuByLongpress / @long-press）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-image-preview from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImagePreview from '@snui/uni-src/components/sn-image-preview/sn-image-preview.vue';

const preview = ref<{
  open: (options?: { images?: string[]; startPosition?: number }) => void;
  close: () => void;
  setActive: (index: number) => void;
} | null>(null);

const images = ['/demo/snui-photo-1.jpg'];

const lastEvent = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" @tap="preview?.open()">打开后长按图片</SnButton>
    <text class="sn-demo__meta">最近事件：{{ lastEvent }}</text>

    <SnImagePreview
      ref="preview"
      :images="images"
      show-menu-by-longpress
      custom-class="sn-demo-contained"
      @long-press="
        (payload: { image: string }) => (lastEvent = `long-press → ${payload.image.slice(-12)}`)
      "
    />

    <text class="sn-demo__meta">
      show-menu-by-longpress 长按弹出识别小程序码菜单（仅微信小程序）；组件同时抛出 `long-press`
      事件，宿主可据此埋点。
    </text>
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
