<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — `customClass` / `customStyle`.
 *
 * Both props land on the sn-icon root node:
 *
 *   - `customClass` appends class names (a string; internally `:class="[customClass]"`)
 *   - `customStyle` merges into the sizing box — a string is written as the root
 *     cssText, an object merges with `width` / `height`
 *
 * Because a string `customStyle` replaces the sizing box, the demo uses it for
 * `color` / `background-color`, and `customClass` for border and padding.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Star, Heart, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">customClass: appends a root class (dashed rounded frame)</text>
    <view class="sn-demo__row">
      <SnIcon :icon="Star" :size="40" custom-class="sn-icon-demo--framed" />
      <SnIcon :icon="Heart" :size="40" custom-class="sn-icon-demo--framed" />
      <SnIcon :icon="Settings" :size="40" custom-class="sn-icon-demo--framed" />
    </view>

    <text class="sn-demo__meta"
      >customStyle (string): written as the root style, replacing the sizing box</text
    >
    <view class="sn-demo__row">
      <SnIcon
        :icon="Star"
        :size="40"
        custom-style="color: var(--sn-mp-color-action-primary); padding: var(--sn-mp-spacing-1); background-color: var(--sn-mp-color-action-primary-soft); border-radius: var(--sn-mp-radius-full);"
      />
    </view>

    <text class="sn-demo__meta"
      >Both together: customClass adds the frame, customStyle sets colour and fill</text
    >
    <view class="sn-demo__row">
      <SnIcon
        :icon="Heart"
        :size="48"
        custom-class="sn-icon-demo--framed"
        custom-style="color: var(--sn-mp-color-feedback-danger); background-color: var(--sn-mp-color-feedback-danger-soft);"
      />
    </view>

    <text class="sn-demo__meta">
      Colour can also come from the color prop; customStyle is only needed for box properties such
      as padding or a fill
    </text>
    <view class="sn-demo__row">
      <SnIcon :icon="Settings" :size="40" color="var(--sn-mp-color-feedback-success)" />
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
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* customClass lands on the sn-icon root node, so it needs :deep. */
.sn-demo :deep(.sn-icon-demo--framed) {
  box-sizing: content-box;
  padding: var(--sn-mp-spacing-1);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
}
</style>
