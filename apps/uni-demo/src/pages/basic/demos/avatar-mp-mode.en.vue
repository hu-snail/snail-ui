<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — image fit (`mode`) + root class / inline style
 * (`customClass` / `customStyle`). The asset is a local 600×400 landscape
 * (diagonal bands mark orientation): aspectFill crops to its middle,
 * aspectFit letterboxes — stable under weak network / offline.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-avatar from its SFC source.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';

const demo = '/static/avatar-mode.png';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"
      >mode is forwarded to the inner &lt;image&gt; (aspectFill crops / aspectFit letterboxes);
      asset: 600×400 landscape.</text
    >
    <view class="sn-demo__row">
      <view class="sn-demo__cell">
        <SnAvatar :src="demo" mode="aspectFill" size="large" />
        <text class="sn-demo__label">aspectFill crop</text>
      </view>
      <view class="sn-demo__cell">
        <SnAvatar :src="demo" mode="aspectFit" size="large" />
        <text class="sn-demo__label">aspectFit letterbox</text>
      </view>
    </view>

    <text class="sn-demo__meta"
      >customClass lands on the root node (outline) and customStyle is appended to its inline
      style.</text
    >
    <view class="sn-demo__row">
      <SnAvatar
        text="CC"
        size="large"
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
        custom-class="sn-avatar-demo__root"
        custom-style="box-shadow: var(--sn-mp-shadow-sm)"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: flex-start;
}
.sn-demo__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-avatar-demo__root) {
  border: 2rpx solid var(--sn-mp-color-action-primary);
}
</style>
