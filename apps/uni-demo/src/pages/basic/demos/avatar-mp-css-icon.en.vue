<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — font icons (`cssIcon` / `iconPrefix`).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-avatar from its SFC source.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      Font-icon layer: with cssIcon true the class is built as `iconPrefix-icon`; a string cssIcon
      is used as the prefix itself. The docs site ships no icon font, so the demo CSS paints
      placeholder glyphs — which proves the class really landed on the glyph node.
    </text>
    <view class="sn-demo__row">
      <view class="sn-demo__font-slot">
        <SnAvatar icon="user" icon-prefix="sn-demo-icon" css-icon size="large" />
        <text class="sn-demo__font-name">sn-demo-icon-user</text>
      </view>
      <view class="sn-demo__font-slot">
        <SnAvatar icon="star" icon-prefix="sn-demo-icon" css-icon size="large" />
        <text class="sn-demo__font-name">sn-demo-icon-star</text>
      </view>
      <view class="sn-demo__font-slot">
        <SnAvatar icon="cart" css-icon="sn-demo-css" size="large" />
        <text class="sn-demo__font-name">sn-demo-css-cart</text>
      </view>
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
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__font-slot {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
}
.sn-demo__font-name {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 20rpx;
  line-height: 1.2;
}
/*
 * Placeholder glyphs: in a real app these classes come from an icon subset / font.
 * Token-only boxes are enough to prove cssIcon / iconPrefix produced the class.
 */
.sn-demo :deep(.sn-demo-icon-user),
.sn-demo :deep(.sn-demo-icon-star),
.sn-demo :deep(.sn-demo-icon-cart),
.sn-demo :deep(.sn-demo-css-cart) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--sn-mp-color-background-subtle);
  border-radius: inherit;
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-demo-icon-user)::after {
  content: 'U';
}
.sn-demo :deep(.sn-demo-icon-star)::after {
  content: 'S';
}
.sn-demo :deep(.sn-demo-icon-cart)::after {
  content: 'C';
}
.sn-demo :deep(.sn-demo-css-cart)::after {
  content: 'F';
}
</style>
