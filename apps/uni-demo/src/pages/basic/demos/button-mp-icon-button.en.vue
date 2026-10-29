<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — icon buttons wired to the built-in sn-icon set.
 *
 * `icon-name` strings are resolved by the embedded sn-icon (registry → built-in
 * lucide catalog → provider); the SVG renders directly, no font file needed.
 * `icon-size` controls the glyph size (rpx).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Common actions</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check" :icon-size="36">Confirm</SnButton>
      <SnButton type="danger" icon-name="trash-2" :icon-size="32">Delete</SnButton>
      <SnButton type="info" icon-name="arrow-right" :icon-size="36">Forward</SnButton>
    </view>

    <text class="sn-demo__label">Icon only (no text)</text>
    <view class="sn-demo__row">
      <SnButton icon-name="settings" :icon-size="40" />
      <SnButton type="primary" icon-name="search" :icon-size="40" />
      <SnButton type="success" icon-name="plus" :icon-size="40" />
      <SnButton type="warning" icon-name="heart" :icon-size="40" />
    </view>

    <text class="sn-demo__label">Icon + loading state</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="download" :icon-size="36">Download</SnButton>
      <SnButton type="primary" loading :icon-size="36" loading-size="36">Downloading</SnButton>
    </view>
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
  gap: 16rpx;
  align-items: center;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
