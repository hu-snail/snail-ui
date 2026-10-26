<script setup lang="ts">
/**
 * Demo: sn-video-preview (uni-end) — full-screen mode and close-button position.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-video-preview from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnVideoPreview from '@snui/uni-src/components/sn-video-preview/sn-video-preview.vue';

const preview = ref<{
  open: (options: { src: string; title?: string; autoplay?: boolean }) => void;
} | null>(null);

const clip = {
  src: 'https://www.w3schools.com/html/mov_bbb.mp4',
  title: 'Full screen, close on the right, autoplay',
  autoplay: true,
};

const calls = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" @tap="preview?.open(clip)">Play full screen</SnButton>
    <text class="sn-demo__meta">on-open callback fired {{ calls }} time(s)</text>

    <SnVideoPreview
      ref="preview"
      full-screen
      close-position="right-top"
      custom-class="sn-demo-contained"
      :on-open="() => (calls += 1)"
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
