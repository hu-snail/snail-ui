<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — the iconfont path: `icon` + `class-prefix` + `css-icon`.
 *
 * sn-button forwards `icon` to the embedded sn-icon; the glyph comes from the
 * iconfont stylesheet the host app loads. The docs site ships no icon font, so
 * the demo draws the generated glyph class with its own CSS — what matters is
 * the class name produced:
 *
 *   - default         → `{classPrefix}-{icon}` = `sn-icon-check`
 *   - `class-prefix`  → rewrites the prefix = `wd-icon-star`
 *   - `css-icon="…"`  → that class verbatim (no prefix) = `demo-glyph`
 *   - `css-icon` bool + `icon` → both `{prefix}-{icon}` and `{icon}`
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** Mirrors sn-icon's glyphClass rule so the demo can print the class name. */
function glyphClass(prefix: string, name: string): string {
  return `${prefix}-${name}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnButton type="primary" icon="check" :icon-size="40">Default prefix</SnButton>
      <SnButton icon="check" :icon-size="40">default type</SnButton>
    </view>
    <text class="sn-demo__meta">Generated class: {{ glyphClass('sn-icon', 'check') }}</text>

    <view class="sn-demo__row">
      <SnButton type="success" icon="star" class-prefix="wd-icon" :icon-size="40">
        class-prefix
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      class-prefix="wd-icon" → generated class: {{ glyphClass('wd-icon', 'star') }}
    </text>

    <view class="sn-demo__row">
      <SnButton type="warning" icon="cart" css-icon="demo-glyph" :icon-size="40">
        css-icon string
      </SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon="demo-glyph" → class applied verbatim: demo-glyph (no prefix added)
    </text>

    <view class="sn-demo__row">
      <SnButton icon="heart" css-icon :icon-size="40">css-icon boolean</SnButton>
    </view>
    <text class="sn-demo__meta">
      css-icon boolean + icon="heart" → both {{ glyphClass('sn-icon', 'heart') }} and heart
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

/*
 * Placeholder glyphs. In a real app these classes come from the iconfont
 * stylesheet; here the demo paints a recognisable box with tokens only, which
 * proves the class produced by icon / class-prefix / css-icon really lands on
 * the glyph node.
 */
.sn-demo :deep(.sn-icon__glyph) {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-icon-check)::after {
  content: 'C';
}
.sn-demo :deep(.wd-icon-star)::after {
  content: 'S';
}
.sn-demo :deep(.demo-glyph)::after {
  content: 'G';
}
.sn-demo :deep(.sn-icon-heart)::after {
  content: 'H';
}
.sn-demo :deep(.heart)::after {
  content: 'H';
}
</style>
