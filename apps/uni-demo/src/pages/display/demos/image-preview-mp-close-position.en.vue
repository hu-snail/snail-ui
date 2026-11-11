<script setup lang="ts">
/**
 * Demo: sn-image-preview (uni-end) — close button position (`closeIconPosition`).
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

const images = [
  'https://picsum.photos/seed/snui-cap-a/900/1200',
  'https://picsum.photos/seed/snui-cap-b/900/1200',
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" @tap="preview?.open()">Open (close button top-left)</SnButton>

    <SnImagePreview
      ref="preview"
      :images="images"
      close-icon-position="top-left"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">
      closeIconPosition defaults to top-right; this demo flips it to top-left.
    </text>
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
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only: the viewer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-image-preview.sn-demo-contained {
  position: absolute;
}
</style>
