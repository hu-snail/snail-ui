<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — block buttons (`block`) × scenes.
 * Spacing note: uni-app x has no flex `gap` support — vertical rhythm uses
 * inline `custom-style` margins.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** Vertical spacing fallback (uni-app x lacks gap). */
const stackGap = { 'margin-bottom': '16rpx' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">Filled (block × semantic hues)</text>
    <SnButton :custom-style="stackGap" block type="primary">Primary button</SnButton>
    <SnButton :custom-style="stackGap" block type="success">Success button</SnButton>
    <SnButton :custom-style="stackGap" block type="danger">Danger button</SnButton>

    <text class="sn-mp-btn-label">Round (block × round)</text>
    <SnButton :custom-style="stackGap" block round type="primary">Round primary button</SnButton>
    <SnButton :custom-style="stackGap" block round type="success">Round success button</SnButton>

    <text class="sn-mp-btn-label">Plain (block × plain)</text>
    <SnButton :custom-style="stackGap" block variant="plain" type="primary">Plain primary button</SnButton>
    <SnButton :custom-style="stackGap" block variant="plain" type="danger">Plain danger button</SnButton>

    <text class="sn-mp-btn-label">Soft (block × soft)</text>
    <SnButton :custom-style="stackGap" block variant="soft" type="primary">Soft primary button</SnButton>
    <SnButton :custom-style="stackGap" block variant="soft" type="success">Soft success button</SnButton>

    <text class="sn-mp-btn-label">Loading (block × loading)</text>
    <SnButton :custom-style="stackGap" block loading type="primary">Saving</SnButton>
    <SnButton block loading type="success">Submitting</SnButton>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
