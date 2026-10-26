<script setup lang="ts">
/**
 * Demo: sn-avatar (uni-end) — css-icon font glyph / icon-prefix / mode / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-avatar from its SFC source.
 */
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';

const demo = 'https://picsum.photos/seed/snui-avatar-mode/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      Font-icon layer: with cssIcon true the class is built as `iconPrefix-icon`; a string cssIcon
      is used as the prefix itself. The docs site ships no icon font, so the demo CSS paints
      placeholder glyphs — which proves the class really landed on the glyph node.
    </text>
    <view class="sn-demo__row">
      <SnAvatar icon="user" icon-prefix="sn-demo-icon" css-icon />
      <SnAvatar icon="star" icon-prefix="sn-demo-icon" css-icon />
      <SnAvatar icon="cart" css-icon="sn-demo-css" />
    </view>

    <text class="sn-demo__meta"
      >mode is forwarded to the inner &lt;image&gt; (aspectFill crops / aspectFit
      letterboxes).</text
    >
    <view class="sn-demo__row">
      <SnAvatar :src="demo" mode="aspectFill" size="large" />
      <SnAvatar :src="demo" mode="aspectFit" size="large" />
    </view>

    <text class="sn-demo__meta"
      >customClass lands on the root node (outline) and customStyle is appended to its inline
      style.</text
    >
    <view class="sn-demo__row">
      <SnAvatar
        text="CC"
        size="large"
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
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
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
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
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
.sn-demo :deep(.sn-avatar-demo__root) {
  border: 2rpx solid var(--sn-mp-color-action-primary);
}
</style>
