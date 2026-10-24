<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — basic bottom sheet.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue'

const bottomOpen = ref(false)
const centerOpen = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @click="bottomOpen = true">Bottom sheet (bottom)</SnButton>
    <SnButton block @click="centerOpen = true">Centered popup (center)</SnButton>

    <SnPopup
      v-model="bottomOpen"
      position="bottom"
      round
      custom-class="sn-demo-contained"
    >
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">Bottom sheet</text>
        <text class="sn-popup-demo__text">Tap the scrim or the close button to dismiss.</text>
        <SnButton type="primary" block @click="bottomOpen = false">Got it</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="centerOpen"
      position="center"
      round
      closable
      custom-class="sn-demo-contained"
    >
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">Centered popup</text>
        <text class="sn-popup-demo__text">closable adds the top-right close button.</text>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-popup-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popup-demo__title {
  font-size: 32rpx;
  font-weight: 600;
}
.sn-popup-demo__text {
  font-size: 28rpx;
  color: var(--vp-c-text-2);
}
/*
 * Docs-preview only: the popup root is `position: fixed` (correct for the real
 * uni-app runtime), which would cover the whole docs page instead of the phone
 * screen. `custom-class` lands on the component root, so the preview pins it to
 * the phone screen's containing block. Not needed in a real app.
 */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
