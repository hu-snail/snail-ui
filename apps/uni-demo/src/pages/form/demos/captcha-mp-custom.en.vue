<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — custom tips / size / tolerance / locked scrim.
 *
 * The poster is a network URL; `tolerance` loosens the alignment window,
 * `closeOnClickModal=false` keeps a scrim tap from closing, and `refreshable`
 * exposes the refresh button.
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-custom/640/320';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Custom tips / size / tolerance</text>
      <text class="sn-demo__panel-desc">
        tips and successText rewrite the copy, tolerance loosens the alignment
        window, and a scrim tap does not close.
      </text>
      <SnButton type="primary" block @tap="show = true">Open custom captcha</SnButton>
    </view>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
      :width="320"
      :height="160"
      tips="Slide the puzzle into the frame"
      success-text="human check passed"
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
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__panel-title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__panel-desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
