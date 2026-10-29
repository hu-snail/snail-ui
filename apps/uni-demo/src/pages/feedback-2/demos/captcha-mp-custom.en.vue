<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 自定义：文案 / 尺寸 / 容差 / 关闭遮罩行为。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-captcha from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);

function poster(): string {
  return (
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320">` +
        `<rect width="640" height="320" fill="#f59e0b"/>` +
        `<path d="M0 220 Q160 120 320 220 T640 220 V320 H0 Z" fill="#fbbf24"/>` +
        `<circle cx="500" cy="90" r="46" fill="rgba(255,255,255,0.35)"/>` +
        `</svg>`,
    )
  );
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="show = true">
      Custom tips / size / tolerance / locked scrim
    </SnButton>

    <SnCaptcha
      v-model="show"
      :src="poster()"
      :width="320"
      :height="160"
      tips="Slide the puzzle into the frame"
      success-text="human check ✓"
      :tolerance="16"
      :close-on-click-modal="false"
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
/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
