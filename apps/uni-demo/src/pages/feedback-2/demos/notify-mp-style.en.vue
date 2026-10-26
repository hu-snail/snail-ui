<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — color / background / z-index / safe-height /
 * custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';

const customFill = ref(false);
const navOffset = ref(false);
const layered = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="customFill">color / background override</SnButton>
    <SnButton block @tap="navOffset">safe-height (space for a custom nav bar)</SnButton>
    <SnButton block @tap="layered">z-index=300 + custom-style</SnButton>

    <text class="sn-demo__meta">
      color overrides the text color and background the fill; safe-height adds top padding;
      root-portal is declared for parity only and has no effect on miniprogram.
    </text>

    <SnNotify
      v-model:visible="customFill"
      type="primary"
      message="Custom fill and text color"
      color="var(--sn-mp-color-text-primary)"
      background="var(--sn-mp-color-feedback-warning-soft)"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="navOffset"
      type="info"
      message="safe-height = 88: stands in for a custom nav bar"
      :safe-height="88"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="layered"
      type="success"
      message="z-index = 300 with custom-style layered on"
      :z-index="300"
      :root-portal="true"
      selector="sn-demo-notify"
      custom-style="padding-left: var(--sn-mp-spacing-5);"
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
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
