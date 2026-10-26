<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — `color` / `bgColor` 内联覆盖 + `iconPrefix` / `cssIcon`
 * 字体图标 + `customClass` / `customStyle`。
 *
 *   - `color`   只改文字色（内联 `color`）
 *   - `bgColor` 同时改底色与边框色（内联 `background-color` + `border-color`）
 *   - `iconPrefix` + `cssIcon` 拼出 `{iconPrefix}-{icon}` 类；`cssIcon` 传字符串时
 *     该字符串直接当类前缀用
 *   - `customClass` 追加到根节点 class，`customStyle` 追加到根节点 inline style
 *
 * 文档站没有图标字体，字形用 demo 自带 CSS 画占位。
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 覆盖色全部走 token，暗色下自动翻转。 */
const overrides = [
  { label: 'color', color: 'var(--sn-mp-color-action-primary)', bgColor: '' },
  { label: 'bgColor', color: '', bgColor: 'var(--sn-mp-color-purple)' },
  {
    label: 'both',
    color: 'var(--sn-mp-color-text-on-primary)',
    bgColor: 'var(--sn-mp-color-feedback-info)',
  },
];

/** 字体图标：iconPrefix 拼前缀，cssIcon 字符串直接当前缀。 */
const glyphs = [
  { icon: 'star', iconPrefix: 'sn-demo-tag-icon' },
  { icon: 'heart', iconPrefix: 'sn-demo-tag-icon' },
  { icon: 'check', iconPrefix: 'sn-demo-tag-icon' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">color / bgColor 内联覆盖（底色与边框同步改）</text>
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
      iconPrefix + cssIcon：生成的类名 {{ 'sn-demo-tag-icon-star' }} / -heart / -check
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

    <text class="sn-demo__meta">cssIcon 传字符串：该值直接当类前缀</text>
    <view class="sn-demo__row">
      <SnTag type="warning" icon="cart" css-icon="sn-demo-tag" variant="plain"> 自定义前缀 </SnTag>
    </view>

    <text class="sn-demo__meta">customClass 常驻根节点（虚线框），customStyle 追加内联样式</text>
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
        两者叠加
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
/* customClass：常驻根节点。 */
.sn-demo :deep(.sn-demo-tag--root) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
/*
 * 占位字形：真实项目里由 iconfont 样式表提供，这里只用令牌画一个可辨识的方块，
 * 证明 iconPrefix / cssIcon 拼出的类确实挂在图标节点上。
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
