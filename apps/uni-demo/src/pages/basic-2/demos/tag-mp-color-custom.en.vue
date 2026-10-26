<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — inline `color` / `bgColor` overrides, the `iconPrefix` /
 * `cssIcon` iconfont path, plus `customClass` / `customStyle`.
 *
 *   - `color`   overrides the label colour only (inline `color`)
 *   - `bgColor` overrides fill and border together (`background-color` + `border-color`)
 *   - `iconPrefix` + `cssIcon` build `{iconPrefix}-{icon}`; a string `cssIcon` is used
 *     as the class prefix itself
 *   - `customClass` is appended to the root class, `customStyle` to the root inline style
 *
 * The docs site ships no icon font, so the glyphs are painted by demo CSS.
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Overrides use tokens only, so they flip in dark mode. */
const overrides = [
  { label: 'color', color: 'var(--sn-mp-color-action-primary)', bgColor: '' },
  { label: 'bgColor', color: '', bgColor: 'var(--sn-mp-color-purple)' },
  {
    label: 'both',
    color: 'var(--sn-mp-color-text-on-primary)',
    bgColor: 'var(--sn-mp-color-feedback-info)',
  },
];

/** Iconfont: iconPrefix builds the prefix, a string cssIcon is the prefix itself. */
const glyphs = [
  { icon: 'star', iconPrefix: 'sn-demo-tag-icon' },
  { icon: 'heart', iconPrefix: 'sn-demo-tag-icon' },
  { icon: 'check', iconPrefix: 'sn-demo-tag-icon' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"
      >Inline color / bgColor overrides (fill and border change together)</text
    >
    <view class="sn-demo__row">
      <SnTag
        v-for="item in overrides"
        :key="item.label"
        type="primary"
        :color="item.color || undefined"
        :bg-color="item.bgColor || undefined"
      >
        {{ item.label }}
      </SnTag>
    </view>

    <text class="sn-demo__meta">
      iconPrefix + cssIcon: the generated classes are {{ 'sn-demo-tag-icon-star' }} / -heart /
      -check
    </text>
    <view class="sn-demo__row">
      <SnTag
        v-for="item in glyphs"
        :key="item.icon"
        type="success"
        variant="light"
        :icon="item.icon"
        :icon-prefix="item.iconPrefix"
        css-icon
      >
        {{ item.icon }}
      </SnTag>
    </view>

    <text class="sn-demo__meta">cssIcon with a string: that value becomes the class prefix</text>
    <view class="sn-demo__row">
      <SnTag type="warning" icon="cart" css-icon="sn-demo-tag" variant="plain">
        Custom prefix
      </SnTag>
    </view>

    <text class="sn-demo__meta"
      >customClass stays on the root (dashed frame), customStyle appends inline style</text
    >
    <view class="sn-demo__row">
      <SnTag type="primary" custom-class="sn-demo-tag--root">customClass</SnTag>
      <SnTag
        type="danger"
        variant="light"
        custom-style="padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3); border-radius: var(--sn-mp-radius-full);"
      >
        customStyle
      </SnTag>
      <SnTag
        type="default"
        variant="plain"
        custom-class="sn-demo-tag--root"
        custom-style="letter-spacing: 2rpx;"
      >
        Both together
      </SnTag>
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
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* customClass: always on the root node. */
.sn-demo :deep(.sn-demo-tag--root) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
/*
 * Placeholder glyphs: a real app gets these from the iconfont stylesheet; here the
 * demo paints a recognisable box with tokens, proving the classes built from
 * iconPrefix / cssIcon land on the icon node.
 */
.sn-demo :deep(.sn-demo-tag-icon-star),
.sn-demo :deep(.sn-demo-tag-icon-heart),
.sn-demo :deep(.sn-demo-tag-icon-check),
.sn-demo :deep(.sn-demo-tag-cart) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28rpx;
  height: 28rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.sn-demo-tag-icon-star)::after {
  content: 'S';
}
.sn-demo :deep(.sn-demo-tag-icon-heart)::after {
  content: 'H';
}
.sn-demo :deep(.sn-demo-tag-icon-check)::after {
  content: 'C';
}
.sn-demo :deep(.sn-demo-tag-cart)::after {
  content: 'G';
}
</style>
