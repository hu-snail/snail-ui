<script setup lang="ts">
/**
 * Demo: sn-video-preview (uni-end) — selector / z-index / custom-style / on-close。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-video-preview from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnVideoPreview from '@snui/uni-src/components/sn-video-preview/sn-video-preview.vue'

const preview = ref<{ open: (options: { src: string; poster?: string; title?: string }) => void; close: () => void } | null>(null)

const clip = {
  src: 'https://www.w3schools.com/html/mov_bbb.mp4',
  poster: 'https://picsum.photos/seed/snui-video-cfg/750/420',
  title: '自定义层级与样式',
}

const opened = ref(0)
const closed = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" type="primary" @tap="preview?.open(clip)">打开（z-index 1500）</SnButton>
    <SnButton size="small" @tap="preview?.close()">关闭</SnButton>
    <text class="sn-demo__meta">on-open 触发 {{ opened }} 次；on-close 触发 {{ closed }} 次</text>

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
      selector 会渲染成 data-selector（实例标识，对齐参考 API）；z-index 透传给内部 sn-popup；customStyle 追加到
      层根节点的 inline style。on-open / on-close 是 prop 形式的回调，组件只调用一次，不会与同名事件重复触发。
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
