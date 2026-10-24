<script setup lang="ts">
/**
 * Demo: sn-video-preview (uni-end) — 打开视频预览层。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-video-preview from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnVideoPreview from '@snui/uni-src/components/sn-video-preview/sn-video-preview.vue'

const preview = ref<{ open: (options: { src: string; poster?: string; title?: string }) => void } | null>(null)

const clip = {
  src: 'https://www.w3schools.com/html/mov_bbb.mp4',
  poster: 'https://picsum.photos/seed/snui-video/750/420',
  title: '产品介绍',
}

const lastEvent = ref('—')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" type="primary" @tap="preview?.open(clip)">播放视频</SnButton>
    <text class="sn-demo__meta">最近事件：{{ lastEvent }}</text>

    <SnVideoPreview
      ref="preview"
      custom-class="sn-demo-contained"
      @open="lastEvent = 'open'"
      @close="lastEvent = 'close'"
    />
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
