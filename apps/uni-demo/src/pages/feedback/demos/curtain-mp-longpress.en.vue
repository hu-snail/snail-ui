<script setup lang="ts">
/**
 * Demo: sn-curtain (uni-end) — English shadow of curtain-mp-longpress.
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
    <SnButton type="primary" block @tap="open = true">Long-press the image for the menu</SnButton>

    <text class="sn-demo__meta">
      show-menu-by-longpress is forwarded to the image and only takes effect in the WeChat
      miniprogram; H5 / App hosts have no such capability.
    </text>

    <SnCurtain
      v-model="open"
      :src="poster('long-press')"
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
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-curtain.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
