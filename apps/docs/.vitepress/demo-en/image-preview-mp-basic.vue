<script setup lang="ts">
/**
 * Demo: sn-image-preview (uni-end) — thumbnail tap to preview + imperative API.
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
  'https://picsum.photos/seed/snui-prev-a/900/1400',
  'https://picsum.photos/seed/snui-prev-b/900/1400',
  'https://picsum.photos/seed/snui-prev-c/900/1400',
]

const lastEvent = ref('—')

function openAt(index: number) {
  preview.value?.open({ startPosition: index })
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__thumbs">
      <view v-for="(image, index) in images" :key="image" class="sn-demo__thumb" @tap="openAt(index)">
        <SnImg :src="image" :width="150" :height="150" mode="aspectFill" radius="8" />
      </view>
    </view>

    <SnButton size="small" @tap="preview?.open()">Open from the first image</SnButton>
    <text class="sn-demo__meta">Last event: {{ lastEvent }}</text>

    <SnImagePreview
      ref="preview"
      :images="images"
      show-index
      custom-class="sn-demo-contained"
      @open="lastEvent = 'open'"
      @close="lastEvent = 'close'"
      @change="(payload: { index: number }) => (lastEvent = 'change → ' + payload.index)"
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
.sn-demo__thumbs {
  display: flex;
  gap: 12rpx;
}
.sn-demo__thumb {
  overflow: hidden;
  border-radius: 8rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
/* Docs-preview only: the viewer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-image-preview.sn-demo-contained {
  position: absolute;
}
</style>
