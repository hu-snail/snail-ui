<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — popup form.
 *
 * The default shape: `v-model` drives the popup, and a trigger covers the
 * viewport with a scrim once tapped. `closeOnClickModal` / `refreshable`
 * control scrim-close and the refresh button. The poster is a network URL, so
 * every refresh re-cuts the notch from a real photo.
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);
const lastResult = ref('not verified yet');

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-popup/600/400';

function onSuccess(): void {
  passed.value = true;
  lastResult.value = 'verification passed';
}

function onFail(): void {
  passed.value = false;
  lastResult.value = 'verification failed, reset';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Tap to open (popup)</text>
      <text class="sn-demo__panel-desc">
        The default shape: a trigger opens a scrim popup; align the slider with
        the notch to pass.
      </text>
      <SnButton type="primary" block @tap="show = true">Start verification</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Scrim stays open · refreshable</text>
      <text class="sn-demo__panel-desc">
        With close-on-click-modal=false a scrim tap keeps it open; refreshable
        adds the refresh button.
      </text>
      <SnButton block @tap="show = true">Verify again</SnButton>
    </view>

    <text class="sn-demo__meta">Last result: {{ lastResult }}</text>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
      :width="300"
      :height="200"
      custom-class="sn-demo-contained"
      @success="onSuccess"
      @fail="onFail"
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
