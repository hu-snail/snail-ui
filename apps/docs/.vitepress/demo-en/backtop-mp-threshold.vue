<script setup lang="ts">
/**
 * Demo: sn-backtop — `top` threshold, `icon-style`, `z-index` and `custom-class`.
 *
 * - `top` is the visibility threshold in px; `scroll-top` comes from the host
 * - `icon-style` is appended after the icon's inline style (which already carries
 *   `rotate(-90deg)` so the glyph points up)
 * - `z-index` participates in the root's positioning style
 * - `custom-class` / `custom-style` land on the root node
 *
 * Docs-preview only: the root is `position: fixed`, so `custom-class` pins it inside
 * this stage.
 */
import { ref } from 'vue'
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue'

const scrollTop = ref(0)
const clicks = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__meta">Threshold top=120, current scroll-top={{ scrollTop }}</text>

      <view class="sn-demo__actions">
        <text class="sn-demo__button" @tap="scrollTop = 80">80 (below threshold, hidden)</text>
        <text class="sn-demo__button" @tap="scrollTop = 200">200 (above threshold, shown)</text>
        <text class="sn-demo__button" @tap="scrollTop = 0">Reset</text>
      </view>

      <SnBacktop
        :scroll-top="scrollTop"
        :top="120"
        :z-index="30"
        icon-style="color: var(--sn-mp-color-action-primary);"
        text="Top"
        custom-class="sn-demo-contained"
        @click="clicks += 1"
      />
    </view>

    <text class="sn-demo__meta">Clicks: {{ clicks }}</text>
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  height: 480rpx;
  padding: var(--sn-mp-spacing-4);
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 22rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — pin the fixed button to the stage. */
.sn-demo__stage :deep(.sn-backtop.sn-demo-contained) {
  position: absolute;
}
</style>
