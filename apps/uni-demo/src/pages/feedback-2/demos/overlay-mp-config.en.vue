<script setup lang="ts">
/**
 * Demo: sn-overlay (uni-end) — duration / lockScroll / zIndex / custom style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-overlay from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnOverlay from '@snui/uni-src/components/sn-overlay/sn-overlay.vue';

const noAnim = ref(false);
const slow = ref(false);
const unlocked = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton block @click="noAnim = true">duration=false (no animation)</SnButton>
    <SnButton block @click="slow = true">duration=800 (slow fade)</SnButton>
    <SnButton block @click="unlocked = true">lockScroll=false (page keeps scrolling)</SnButton>

    <SnOverlay
      :show="noAnim"
      :duration="false"
      custom-class="sn-demo-contained"
      @click="noAnim = false"
    >
      <text class="sn-overlay-demo__hint">No animation: show / hide apply instantly</text>
    </SnOverlay>

    <SnOverlay
      :show="slow"
      :duration="800"
      :z-index="30"
      custom-class="sn-demo-contained"
      @click="slow = false"
    >
      <text class="sn-overlay-demo__hint">800ms fade, z-index 30</text>
    </SnOverlay>

    <SnOverlay
      :show="unlocked"
      :lock-scroll="false"
      custom-class="sn-demo-contained"
      custom-style="padding: 8px"
      @click="unlocked = false"
    >
      <text class="sn-overlay-demo__hint">lockScroll=false: the page behind still scrolls</text>
    </SnOverlay>
  </view>
</template>

<style scoped>
.sn-overlay-demo__hint {
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  background: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  font-size: 28rpx;
}
/* Docs-preview only: keep the fixed-position scrim inside the phone screen. */
.sn-overlay.sn-demo-contained {
  position: absolute;
}
</style>
