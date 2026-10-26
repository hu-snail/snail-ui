<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — vertical dividers plus custom-class / custom-style.
 *
 * `vertical` and `direction="vertical"` are the same axis; the two spellings
 * are equivalent. A vertical divider defaults to `height: 1em` (it follows the
 * current line height); use custom-class / custom-style to make it taller —
 * both props land on the root node.
 */
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <text class="sn-demo__word">Edit</text>
      <SnDivider vertical />
      <text class="sn-demo__word">Copy</text>
      <SnDivider vertical />
      <text class="sn-demo__word">Delete</text>
    </view>
    <text class="sn-demo__meta"
      >The vertical shorthand (1em tall by default, follows the line height)</text
    >

    <view class="sn-demo__row">
      <text class="sn-demo__word">Axis</text>
      <SnDivider direction="vertical" dashed />
      <text class="sn-demo__word">vertical dashed</text>
      <SnDivider direction="vertical" color="var(--sn-mp-color-action-primary)" />
      <text class="sn-demo__word">custom colour</text>
    </view>
    <text class="sn-demo__meta"
      >direction="vertical" is equivalent to vertical; dashed / color apply too</text
    >

    <view class="sn-demo__row sn-demo__row--tall">
      <text class="sn-demo__word">custom-class</text>
      <SnDivider vertical custom-class="sn-demo__tall-divider" />
      <text class="sn-demo__word">custom-style</text>
      <SnDivider vertical custom-style="height: 64rpx;" />
      <text class="sn-demo__word">taller divider</text>
    </view>
    <text class="sn-demo__meta"
      >custom-class / custom-style land on the root and can override the default height</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8rpx;
  width: 100%;
}
.sn-demo__row--tall {
  min-height: 96rpx;
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
/* custom-class lands on the sn-divider root, so it needs :deep. */
.sn-demo :deep(.sn-demo__tall-divider) {
  height: 64rpx;
  border-left-color: var(--sn-mp-color-action-primary);
}
</style>
