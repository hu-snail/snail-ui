<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — hairline border toggle (every semantic hue).
 *
 * hairline defaults to true: the default type paints a neutral hairline and
 * semantic types render as outlines in their own hue; `false` strips borders
 * on every type. Loading states live in the dedicated loading module.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">Hairline on (default): semantic types stroke in their own hue</text>
    <view class="sn-demo__row">
      <SnButton>Default button</SnButton>
      <SnButton variant="plain" type="primary">Primary button</SnButton>
      <SnButton variant="plain" type="success">Success button</SnButton>
      <SnButton variant="plain" type="info">Info button</SnButton>
      <SnButton variant="plain" type="warning">Warning button</SnButton>
      <SnButton variant="plain" type="danger">Danger button</SnButton>
    </view>

    <text class="sn-demo__meta">Hairline off (hairline=false): borders stripped on every type</text>
    <view class="sn-demo__row">
      <SnButton :hairline="false">Default button</SnButton>
      <SnButton :hairline="false" variant="plain" type="primary">Primary button</SnButton>
      <SnButton :hairline="false" variant="plain" type="success">Success button</SnButton>
      <SnButton :hairline="false" variant="plain" type="info">Info button</SnButton>
      <SnButton :hairline="false" variant="plain" type="warning">Warning button</SnButton>
      <SnButton :hairline="false" variant="plain" type="danger">Danger button</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
