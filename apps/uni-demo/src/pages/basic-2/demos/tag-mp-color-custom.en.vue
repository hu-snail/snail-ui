<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — customising beyond the semantic palette.
 *
 * `bgColor` takes over fill and border together (brand-colour scenes);
 * `color` overrides the label colour only. `cssIcon` routes a string icon
 * explicitly to the font-glyph path (`iconPrefix` builds the prefix, a string
 * value is the prefix itself); the glyph comes from the host iconfont, so the
 * demo paints geometric placeholders on the icon node to prove the generated
 * classes land (no pseudo-elements). `customClass` / `customStyle` append root
 * styling.
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Brand fills: fill and border change together, labels stay white. */
const brandFills = [
  { label: 'Black card', bgColor: 'var(--sn-mp-color-purple)' },
  { label: 'Pinned', bgColor: 'var(--sn-mp-color-feedback-info)' },
];

/** Colour-only tints: themed labels on the plain / light / text variants. */
const tints = [
  {
    label: 'Quiet',
    variant: 'plain',
    color: 'var(--sn-mp-color-action-primary)',
  },
  {
    label: 'Read',
    variant: 'light',
    color: 'var(--sn-mp-color-text-tertiary)',
  },
  {
    label: 'Demoted',
    variant: 'text',
    color: 'var(--sn-mp-color-feedback-danger)',
  },
] as const;

/** Iconfont glyphs: iconPrefix + cssIcon build sn-demo-tag-icon-{name}. */
const glyphs = [
  { icon: 'star' },
  { icon: 'heart' },
  { icon: 'check' },
] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">bgColor takes over fill and border (brand colour)</text>
    <view class="sn-demo__row">
      <SnTag
        v-for="fill in brandFills"
        :key="fill.label"
        :bg-color="fill.bgColor"
      >
        {{ fill.label }}
      </SnTag>
    </view>

    <text class="sn-demo__meta">color overrides the label colour only</text>
    <view class="sn-demo__row">
      <SnTag
        v-for="tint in tints"
        :key="tint.label"
        type="default"
        :variant="tint.variant"
        :color="tint.color"
      >
        {{ tint.label }}
      </SnTag>
    </view>

    <text class="sn-demo__meta">cssIcon font glyphs (shapes stand in for host glyphs)</text>
    <view class="sn-demo__row">
      <SnTag
        v-for="glyph in glyphs"
        :key="glyph.icon"
        type="success"
        variant="light"
        :icon="glyph.icon"
        icon-prefix="sn-demo-tag-icon"
        css-icon
      >
        {{ glyph.icon }}
      </SnTag>
      <SnTag type="warning" variant="plain" icon="diamond" css-icon="sn-demo-tag-gem">
        Custom prefix
      </SnTag>
    </view>

    <text class="sn-demo__meta">customClass / customStyle append root styling</text>
    <view class="sn-demo__row">
      <SnTag type="primary" custom-class="sn-demo-tag--root">customClass</SnTag>
      <SnTag
        type="danger"
        variant="light"
        custom-style="padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-6); border-radius: var(--sn-mp-radius-full);"
      >
        customStyle
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: stretch;
  width: 100%;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
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
 * cssIcon class-mount placeholders: a real app draws the glyph from its
 * iconfont stylesheet; here geometric shapes are painted directly on the icon
 * node (no pseudo-elements) to prove the generated classes land on it.
 */
.sn-demo :deep(.sn-demo-tag-icon-star),
.sn-demo :deep(.sn-demo-tag-icon-heart),
.sn-demo :deep(.sn-demo-tag-icon-check),
.sn-demo :deep(.sn-demo-tag-gem-diamond) {
  width: var(--sn-mp-icon-size-small);
  height: var(--sn-mp-icon-size-small);
  background-color: currentColor;
}

.sn-demo :deep(.sn-demo-tag-icon-star) {
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}

.sn-demo :deep(.sn-demo-tag-icon-heart) {
  border-radius: var(--sn-mp-radius-full);
}

.sn-demo :deep(.sn-demo-tag-icon-check) {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.sn-demo :deep(.sn-demo-tag-gem-diamond) {
  clip-path: polygon(20% 0%, 80% 0%, 100% 40%, 50% 100%, 0% 40%);
}
</style>
