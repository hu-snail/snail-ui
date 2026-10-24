<script setup lang="ts">
/**
 * Demo: sn-image-preview (uni-end) — 关闭按钮位置、页码开关与底部插槽。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-image-preview from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnImagePreview from '@snui/uni-src/components/sn-image-preview/sn-image-preview.vue'

const preview = ref<{
  open: (options?: { images?: string[]; startPosition?: number }) => void
  close: () => void
  setActive: (index: number) => void
} | null>(null)

const images = [
  '/demo/snui-photo-2.jpg',
  '/demo/snui-photo-3.jpg',
]
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnButton size="small" @tap="preview?.open()">打开（左上关闭 / 无页码 / 底部插槽）</SnButton>

    <SnImagePreview
      ref="preview"
      :images="images"
      close-icon-position="top-left"
      :show-index="false"
      custom-class="sn-demo-contained"
    >
      <template #default="{ current }">
        <text class="sn-demo__caption">第 {{ current + 1 }} 张 / 共 {{ images.length }} 张</text>
      </template>
    </SnImagePreview>
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
.sn-demo__caption {
  color: var(--sn-mp-color-text-on-primary);
  font-size: 24rpx;
}
/* Docs-preview only: the viewer root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-image-preview.sn-demo-contained {
  position: absolute;
}
</style>
