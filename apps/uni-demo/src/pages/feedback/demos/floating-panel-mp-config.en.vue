<script setup lang="ts">
/**
 * Demo: sn-floating-panel (uni-end) — controlled height, disabled animation,
 * no content drag, hidden scrollbar, safe-area inset.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-floating-panel from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnFloatingPanel from '@snui/uni-src/components/sn-floating-panel/sn-floating-panel.vue';

const height = ref(200);
const contentDraggable = ref(false);

function expand(): void {
  height.value = 380;
}

function shrink(): void {
  height.value = 160;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="expand">Expand to 380</SnButton>
    <SnButton block @tap="shrink">Collapse to 160</SnButton>

    <text class="sn-floating-panel-demo__meta">
      Height is controlled from outside: {{ Math.round(height) }}
    </text>

    <SnFloatingPanel
      v-model:height="height"
      :anchors="[160, 380]"
      :duration="0"
      :content-draggable="contentDraggable"
      :show-scrollbar="false"
      safe-area-inset-bottom
      custom-class="sn-demo-contained"
    >
      <view class="sn-floating-panel-demo__body">
        <text class="sn-floating-panel-demo__title">duration=0: snapping is instant</text>
        <text class="sn-floating-panel-demo__item"
          >content-draggable=false: dragging the content does not resize</text
        >
        <text class="sn-floating-panel-demo__item"
          >show-scrollbar=false: the scrollbar is hidden</text
        >
        <text class="sn-floating-panel-demo__item"
          >safe-area-inset-bottom: pads the bottom safe area</text
        >
      </view>
    </SnFloatingPanel>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-height: 520rpx;
}
.sn-floating-panel-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
.sn-floating-panel-demo__body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 16rpx;
}
.sn-floating-panel-demo__title {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-floating-panel-demo__item {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — keep the fixed-position panel inside the phone screen. */
.sn-floating-panel.sn-demo-contained {
  position: absolute;
}
</style>
