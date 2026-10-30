<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — basic usage: v-model opens, success reports.
 *
 * The poster is a network URL (stable picsum seed), so every refresh re-cuts
 * the notch from a real photo; `v-model` closes the popup and `success` /
 * `fail` report the outcome.
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-basic/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Basic usage</text>
      <text class="sn-demo__panel-desc">
        v-model drives the popup; aligning the piece with the notch emits
        success.
      </text>
      <SnButton type="primary" block @tap="show = true">Jigsaw captcha</SnButton>
      <text class="sn-demo__meta">Result: {{ passed ? 'passed' : 'pending' }}</text>
    </view>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
