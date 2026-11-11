<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — English shadow of popup-mp-custom-style.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

const scrimStyle = ref(false);
const panelStyle = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="scrimStyle = true"
      >modal-style (scrim inline style)</SnButton
    >
    <SnButton block @tap="panelStyle = true">custom-style (panel inline style)</SnButton>

    <SnPopup
      v-model="scrimStyle"
      position="center"
      round
      modal-style="background-color: var(--sn-mp-color-background-subtle); opacity: 0.8;"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">modalStyle</text>
        <text class="sn-demo__text">
          The inline style lands on the scrim node, so opacity or extra padding can be layered on.
        </text>
        <SnButton type="primary" block @tap="scrimStyle = false">Close</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="panelStyle"
      position="bottom"
      round
      custom-style="padding-bottom: var(--sn-mp-spacing-8);"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">customStyle</text>
        <text class="sn-demo__text">custom-style lands on the panel.</text>
        <SnButton type="primary" block @tap="panelStyle = false">Close</SnButton>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__text,
.sn-demo__meta {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only: keep the fixed-position popup inside the phone screen. */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
