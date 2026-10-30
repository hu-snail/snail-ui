<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — 语义色之外的自定义外观。
 *
 * `bgColor` 同步接管底色与边框（品牌色场景）；`color` 只改文字色。
 * `cssIcon` 让字符串图标显式走字体路径（`iconPrefix` 拼前缀，字符串值
 * 直接当前缀）；字形由宿主 iconfont 提供，demo 用几何形占位验证类名
 * 挂载（禁伪元素，形状画在图标节点本体上）。`customClass` / `customStyle`
 * 追加根节点样式。
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 品牌色接管：底色与边框一起换，文字保持实心变体白字。 */
const brandFills = [
  { label: '黑卡会员', bgColor: 'var(--sn-mp-color-purple)' },
  { label: '置顶', bgColor: 'var(--sn-mp-color-feedback-info)' },
];

/** color 只改文字：描边 / 浅底 / 纯文字三种变体下的主题色文字。 */
const tints = [
  {
    label: '轻量',
    variant: 'plain',
    color: 'var(--sn-mp-color-action-primary)',
  },
  {
    label: '已读',
    variant: 'light',
    color: 'var(--sn-mp-color-text-tertiary)',
  },
  {
    label: '降权',
    variant: 'text',
    color: 'var(--sn-mp-color-feedback-danger)',
  },
] as const;

/** 字体图标：iconPrefix + cssIcon 拼出 sn-demo-tag-icon-{name}。 */
const glyphs = [
  { icon: 'star' },
  { icon: 'heart' },
  { icon: 'check' },
] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">bgColor 接管底色与边框（品牌色）</text>
    <view class="sn-demo__row">
      <SnTag
        v-for="fill in brandFills"
        :key="fill.label"
        :bg-color="fill.bgColor"
      >
        {{ fill.label }}
      </SnTag>
    </view>

    <text class="sn-demo__meta">color 只改文字色</text>
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

    <text class="sn-demo__meta">cssIcon 字体图标（几何形为宿主字形占位）</text>
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
        自定义前缀
      </SnTag>
    </view>

    <text class="sn-demo__meta">customClass / customStyle 追加根节点样式</text>
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

/* customClass：常驻根节点。 */
.sn-demo :deep(.sn-demo-tag--root) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}

/*
 * cssIcon 类名挂载占位：真实项目里字形来自宿主 iconfont 样式表；这里把
 * 几何形直接画在图标节点本体（无伪元素），证明拼出的类确实落在了节点上。
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
