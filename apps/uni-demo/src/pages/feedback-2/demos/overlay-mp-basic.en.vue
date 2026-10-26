<script setup lang="ts">
/**
 * Demo: sn-overlay (uni-end) — basic scrim with a toggle.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-overlay from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnOverlay from '@snui/uni-src/components/sn-overlay/sn-overlay.vue';

const show = ref(false);
const taps = ref(0);

function onScrimTap(): void {
  taps.value += 1;
  show.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @click="show = true">Show the scrim</SnButton>
    <text class="sn-overlay-demo__meta">Scrim taps: {{ taps }}</text>

    <SnOverlay :show="show" custom-class="sn-demo-contained" @click="onScrimTap">
      <view class="sn-overlay-demo__card" @tap.stop>
        <text class="sn-overlay-demo__text"
          >Content on the scrim (tapping the card keeps it open)</text
        >
      </view>
    </SnOverlay>
  </view>
</template>

<style scoped>
.sn-overlay-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
.sn-overlay-demo__card {
  padding: 32rpx;
  border-radius: 16rpx;
  background: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
}
.sn-overlay-demo__text {
  font-size: 28rpx;
}
/* Docs-preview only: keep the fixed-position scrim inside the phone screen. */
.sn-overlay.sn-demo-contained {
  position: absolute;
}
</style>
