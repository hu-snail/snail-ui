<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — css-icon with a string class.
 *
 * `css-icon="my-class"` puts that class verbatim on the glyph node (no
 * classPrefix prepended), which suits icons that already carry their own
 * naming — a background image, a pseudo-element, a font subset.
 * The docs site ships no icon assets, so demo-local CSS draws the placeholder.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnIcon css-icon="demo-icon-cart" :size="40" />
      <SnIcon css-icon="demo-icon-bell" :size="40" />
      <SnIcon css-icon="demo-icon-check" :size="40" />
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-icon-cart" / "demo-icon-bell" / "demo-icon-check" — the class renders verbatim, no prefix added
    </text>

    <view class="sn-demo__row">
      <SnIcon name="search" css-icon :size="40" />
    </view>
    <text class="sn-demo__meta">
      The boolean form with name: both sn-icon-search and search are applied, covering either naming convention
    </text>
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

/*
 * Placeholder CSS icons. In a real app these classes come from an icon subset /
 * background image / font; here tokens alone draw a distinguishable box that
 * proves the class passthrough works.
 */
.sn-demo :deep(.demo-icon-cart),
.sn-demo :deep(.demo-icon-bell),
.sn-demo :deep(.demo-icon-check) {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo :deep(.demo-icon-cart)::after { content: 'C'; }
.sn-demo :deep(.demo-icon-bell)::after { content: 'B'; }
.sn-demo :deep(.demo-icon-check)::after { content: 'V'; }
.sn-demo :deep(.search)::after { content: 'S'; }
.sn-demo :deep(.search) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
