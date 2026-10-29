<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — 点图片关闭（close-on-click 默认 true）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-curtain from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCurtain from '@snui/uni-src/components/sn-curtain/sn-curtain.vue';

/** Build an inline SVG poster so the demo needs no network asset. */
function poster(label: string): string {
  return (
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700">` +
        `<rect width="600" height="700" rx="24" fill="lavender"/>` +
        `<text x="300" y="360" font-size="42" text-anchor="middle" fill="slateblue">${label}</text>` +
        `</svg>`,
    )
  );
}

const show = ref(false);
const tapped = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="show = true">点图片关闭（close-on-click 默认 true）</SnButton>
    <text class="sn-demo__meta">已点图片 {{ tapped }} 次（close 事件回调计数）</text>

    <SnCurtain
      v-model="show"
      :src="poster('点图片关闭')"
      :width="260"
      custom-class="sn-demo-contained"
      @close="tapped += 1"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — keep the fixed-position curtain inside the phone screen. */
.sn-curtain.sn-demo-contained {
  position: absolute;
}
</style>
