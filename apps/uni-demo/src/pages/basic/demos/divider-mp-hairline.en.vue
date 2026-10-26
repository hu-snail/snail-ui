<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — the `hairline` switch.
 *
 * `hairline` defaults to true: a horizontal line gets `border-top-width: 1rpx`
 * and a vertical one `border-left-width: 1rpx`. Setting it false restores the
 * regular 2rpx width.
 *
 * On the 750 design canvas 1rpx is 0.5px, which is the standard mobile
 * one-physical-pixel hairline — it avoids a 2px edge on high-DPI screens.
 */
import { ref } from 'vue';
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';

const hairline = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <text class="sn-demo__word">hairline = {{ hairline }}</text>
      <view class="sn-demo__switch" @tap="hairline = !hairline">
        <text class="sn-demo__switch-label">Toggle</text>
      </view>
    </view>

    <text class="sn-demo__meta">Horizontal: hairline (1rpx) next to the regular width (2rpx)</text>
    <SnDivider :hairline="hairline" />
    <SnDivider :hairline="!hairline" />

    <text class="sn-demo__meta">A horizontal divider with text reacts to hairline too</text>
    <SnDivider :hairline="hairline">hairline</SnDivider>
    <SnDivider :hairline="!hairline">Regular width</SnDivider>

    <text class="sn-demo__meta">Vertical: hairline changes border-left-width</text>
    <view class="sn-demo__row">
      <text class="sn-demo__word">Edit</text>
      <SnDivider vertical :hairline="hairline" />
      <text class="sn-demo__word">Copy</text>
      <SnDivider vertical :hairline="!hairline" />
      <text class="sn-demo__word">Delete</text>
    </view>

    <text class="sn-demo__meta">hairline stacks with dashed: a thin dashed line</text>
    <SnDivider :hairline="hairline" dashed />
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
.sn-demo__word {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__switch {
  display: inline-flex;
  align-items: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__switch-label {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
