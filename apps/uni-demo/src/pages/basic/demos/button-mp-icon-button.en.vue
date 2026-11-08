<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — icon buttons wired to the built-in sn-icon set.
 *
 * `icon-name` strings are resolved by the embedded sn-icon (registry → built-in
 * lucide catalog → provider); the SVG renders directly, no font file needed.
 * The icon size auto-fits the button preset (small 28 / medium 32 / large 40);
 * `icon-size` overrides it explicitly.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Common actions (icon size auto-fits the button preset)</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check">Confirm</SnButton>
      <SnButton type="danger" icon-name="trash-2">Delete</SnButton>
      <SnButton type="info" icon-name="arrow-right">Forward</SnButton>
    </view>

    <text class="sn-demo__label">Icon only (no text)</text>
    <view class="sn-demo__row">
      <SnButton icon-name="settings" />
      <SnButton type="primary" icon-name="search" />
      <SnButton type="success" icon-name="plus" />
      <SnButton type="warning" icon-name="heart" />
    </view>

    <text class="sn-demo__label">Circle icon buttons</text>
    <view class="sn-demo__row">
      <SnButton circle icon-name="settings" />
      <SnButton circle type="primary" icon-name="search" />
      <SnButton circle type="success" icon-name="plus" />
      <SnButton circle type="danger" icon-name="trash-2" />
      <SnButton circle size="small" type="info" icon-name="arrow-right" />
      <SnButton circle size="large" type="warning" icon-name="heart" />
    </view>

    <text class="sn-demo__label">Icon + loading state</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="download">Download</SnButton>
      <SnButton type="primary" loading>Downloading</SnButton>
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
