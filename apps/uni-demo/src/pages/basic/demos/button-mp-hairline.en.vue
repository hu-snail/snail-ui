<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — hairline border toggle (every semantic hue).
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-meta">Hairline on (default): semantic types stroke in their own hue</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap">Default button</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="primary">Primary button</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="success">Success button</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="info">Info button</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="warning">Warning button</SnButton>
      <SnButton :custom-style="rowGap" variant="plain" type="danger">Danger button</SnButton>
    </view>

    <text class="sn-mp-btn-meta">Hairline off (hairline=false): borders stripped on every type</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" :hairline="false">Default button</SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="primary">
        Primary button
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="success">
        Success button
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="info">
        Info button
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="warning">
        Warning button
      </SnButton>
      <SnButton :custom-style="rowGap" :hairline="false" variant="plain" type="danger">
        Danger button
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
