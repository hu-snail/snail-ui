<script setup lang="ts">
/**
 * Demo: sn-video-preview (uni-end) — selector / z-index / custom-style / on-close.
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
  title: 'Custom stacking and style',
};

const opened = ref(0);
const closed = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" type="primary" @tap="preview?.open(clip)">Open (z-index 1500)</SnButton>
    <SnButton size="small" @tap="preview?.close()">Close</SnButton>
    <text class="sn-demo__meta"
      >on-open fired {{ opened }} times; on-close fired {{ closed }} times</text
    >

    <SnVideoPreview
      ref="preview"
      selector="sn-video-preview-demo"
      :z-index="1500"
      custom-class="sn-demo-contained"
      custom-style="border-radius: 16rpx"
      :on-open="() => (opened += 1)"
      :on-close="() => (closed += 1)"
    />

    <text class="sn-demo__meta">
      selector renders as data-selector (an instance marker, mirroring the reference API); z-index
      is forwarded to the inner sn-popup; customStyle is appended to the layer root's inline style.
      on-open / on-close are prop-style callbacks and the component calls them exactly once — they
      never double-fire with the same-named events.
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
/* Docs-preview only: the layer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-video-preview.sn-demo-contained {
  position: absolute;
}
</style>
