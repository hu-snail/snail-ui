<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — Jigsaw captcha基础用法：v-model 打开，success 回调。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-captcha from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);

/** Inline SVG poster so the demo needs no network asset. */
function poster(): string {
  return (
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/>` +
        `</linearGradient></defs>` +
        `<rect width="600" height="400" fill="url(#g)"/>` +
        `<circle cx="150" cy="120" r="70" fill="rgba(255,255,255,0.25)"/>` +
        `<rect x="380" y="180" width="160" height="120" rx="16" fill="rgba(255,255,255,0.2)"/>` +
        `</svg>`,
    )
  );
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="show = true">Jigsaw captcha</SnButton>
    <text class="sn-demo__meta">Result: {{ passed ? 'passed ✓' : 'pending' }}</text>

    <SnCaptcha
      v-model="show"
      :src="poster()"
      :width="300"
      :height="200"
      custom-class="sn-demo-contained"
      @success="passed = true"
      @fail="passed = false"
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
}
/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
