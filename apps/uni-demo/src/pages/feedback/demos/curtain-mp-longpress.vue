<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — show-menu-by-longpress.
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

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">长按图片试试识别菜单</SnButton>

    <text class="sn-demo__meta">
      show-menu-by-longpress 透传给 image，仅微信小程序长按出识别菜单；H5 / App 宿主无此能力。
    </text>

    <SnCurtain
      v-model="open"
      :src="poster('长按识别')"
      :width="260"
      show-menu-by-longpress
      custom-class="sn-demo-contained"
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
