<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — 自定义颜色（bgColor / color）。
 *
 * `bgColor` 同步接管底色与边框（品牌色场景）；`color` 只改文字色。
 * `customClass` / `customStyle` 追加根节点样式（暂无独立 custom demo，顺带展示）。
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
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">bgColor 接管底色与边框（品牌色）</text>
    <view class="sn-demo__row">
      <SnTag v-for="fill in brandFills" :key="fill.label" :bg-color="fill.bgColor">
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
</style>
