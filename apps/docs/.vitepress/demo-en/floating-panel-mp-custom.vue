<script setup lang="ts">
/**
 * Demo: sn-floating-panel (uni-end) — custom-style / custom-class.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-floating-panel from its SFC source.
 */
import { ref } from 'vue'
import SnFloatingPanel from '@snui/uni-src/components/sn-floating-panel/sn-floating-panel.vue'

const height = ref(160)
const items = ['Nearby stores', 'Open 09:00 - 22:00', 'Parking available']
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      custom-style is merged with the component's own height / duration custom properties and
      written on the root node; custom-class appends a root class (rounded corners and a shadow
      here).
    </text>

    <SnFloatingPanel
      v-model:height="height"
      :anchors="[160, 360]"
      custom-class="sn-demo-contained sn-demo__panel"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">Drag the handle to resize</text>
        <text v-for="item in items" :key="item" class="sn-demo__item">{{ item }}</text>
      </view>
    </SnFloatingPanel>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-height: 480rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 16rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__item {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
/* custom-class lands on the sn-floating-panel root node (alongside sn-demo-contained). */
.sn-demo :deep(.sn-demo__panel) {
  box-shadow: var(--sn-mp-shadow-lg);
}
/* Docs-preview only — keep the fixed-position panel inside the phone screen. */
.sn-floating-panel.sn-demo-contained {
  position: absolute;
}
</style>
