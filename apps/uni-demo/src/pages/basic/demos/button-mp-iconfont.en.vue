<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — icons resolved through the sn-icon library.
 *
 * `icon-name` strings are resolved by the embedded sn-icon: registry
 * (registerSnIcons) → built-in catalog (111 lucide glyphs) → provider prefix.
 * No font file needed — the SVG renders directly.
 *
 * `icon` + `class-prefix` + `css-icon` remain the iconfont glyph path (class
 * assembly) for hosts that ship their own icon font.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** Mirrors sn-icon's glyphClass rule so the demo can print the class name. */
function glyphClass(prefix: string, name: string): string {
  return `${prefix}-${name}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">sn-icon library (icon-name → SVG, no font file)</text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon-name="check" :icon-size="36">check</SnButton>
      <SnButton type="success" icon-name="star" :icon-size="36">star</SnButton>
      <SnButton type="warning" icon-name="search" :icon-size="36">search</SnButton>
      <SnButton icon-name="heart" :icon-size="36">heart</SnButton>
    </view>

    <text class="sn-demo__label">Any catalog icon + custom size</text>
    <view class="sn-demo__row">
      <SnButton type="info" icon-name="arrow-right" :icon-size="40">Forward</SnButton>
      <SnButton type="danger" icon-name="trash-2" :icon-size="32">Delete</SnButton>
      <SnButton icon-name="settings" :icon-size="36">Settings</SnButton>
    </view>

    <text class="sn-demo__label">
      iconfont glyph path (icon + class-prefix, font provided by the host)
    </text>
    <view class="sn-demo__row">
      <SnButton type="primary" icon="check" :icon-size="40">Default prefix</SnButton>
      <SnButton type="success" icon="star" class-prefix="wd-icon" :icon-size="40">
        class-prefix
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      Generated classes: {{ glyphClass('sn-icon', 'check') }} / {{ glyphClass('wd-icon', 'star') }}
    </text>

    <text class="sn-demo__label">css-icon: string applied verbatim / boolean applies both</text>
    <view class="sn-demo__row">
      <SnButton type="warning" icon="cart" css-icon="demo-glyph" :icon-size="40">
        css-icon string
      </SnButton>
      <SnButton icon="heart" css-icon :icon-size="40">css-icon boolean</SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-glyph" → demo-glyph verbatim; boolean + icon="heart" → both
      {{ glyphClass('sn-icon', 'heart') }} and heart
    </text>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
