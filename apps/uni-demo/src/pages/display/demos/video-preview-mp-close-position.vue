<script setup lang="ts">
/**
 * Demo: sn-video-preview (uni-end) — 关闭按钮位置（closePosition）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-video-preview from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnVideoPreview from '@snui/uni-src/components/sn-video-preview/sn-video-preview.vue';

const preview = ref<{
  open: (options: { src: string; poster?: string; title?: string }) => void;
  close: () => void;
} | null>(null);

const clip = {
  src: 'https://www.w3schools.com/html/mov_bbb.mp4',
  poster: 'https://picsum.photos/seed/snui-video-cfg/750/420',
  title: '关闭按钮在右上',
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" @tap="preview?.open(clip)">打开（关闭按钮右上）</SnButton>

    <SnVideoPreview
      ref="preview"
      close-position="right-top"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">closePosition 指定关闭按钮位置，这里用 right-top。</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
/* Docs-preview only: the layer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-video-preview.sn-demo-contained {
  position: absolute;
}
</style>
