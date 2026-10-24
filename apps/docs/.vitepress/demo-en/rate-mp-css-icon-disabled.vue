<script setup lang="ts">
/**
 * Demo: sn-rate — cssIcon / disabled / custom-class / custom-style.
 *
 * `css-icon="demo-star"` renders the glyph as a bare CSS class (no prefix);
 * the boolean `css-icon` form applies both `icon` and `active-icon` classes;
 * `disabled` blocks taps and `custom-class` / `custom-style` land on the root.
 */
import { ref } from 'vue'
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'

const css = ref<number | null>(3)
const cssBool = ref<number | null>(2)
const locked = ref<number | null>(3)
const styled = ref<number | null>(4)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate v-model="css" css-icon="demo-star" :num="5" />
    <text class="sn-demo__meta">css-icon="demo-star": the class name is applied verbatim to the glyph node</text>

    <SnRate v-model="cssBool" icon="demo-star-off" active-icon="demo-star" css-icon />
    <text class="sn-demo__meta">boolean css-icon + icon / active-icon: both class names are applied</text>

    <SnRate v-model="locked" disabled />
    <text class="sn-demo__meta">disabled: dimmed icons, taps ignored</text>

    <SnRate
      v-model="styled"
      custom-class="sn-demo__rate"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">custom-class + custom-style are appended to the root node</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-rate root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__rate) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
/*
 * Placeholder CSS icons: in a real app these classes come from an icon subset or
 * a background image. Here tokens draw a distinguishable box that proves the
 * class passthrough works.
 */
.sn-demo :deep(.demo-star),
.sn-demo :deep(.demo-star-off) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid currentColor;
  border-radius: var(--sn-mp-radius-full);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.demo-star)::after { content: 'A'; }
.sn-demo :deep(.demo-star-off)::after { content: 'B'; }
</style>
