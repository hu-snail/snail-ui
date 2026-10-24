<script setup lang="ts">
/**
 * Demo: sn-text (uni-end) — custom-class / custom-style 与三个插槽。
 *
 * props 覆盖不到的部分由插槽承担：`default` 覆盖 `text`，`prefix` / `suffix`
 * 覆盖对应 prop，因此插槽里可以放任意跨端节点，而不只是一段字符串。
 */
import SnText from '@snui/uni-src/components/sn-text/sn-text.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnText
      custom-class="sn-demo__highlight"
      custom-style="padding: 4rpx 12rpx; border-radius: var(--sn-mp-radius-sm);"
      text="custom-class + custom-style 追加在根节点上"
    />
    <text class="sn-demo__meta">根节点同时挂 sn-text 与 sn-demo__highlight 两个类，内联样式覆盖内边距与圆角。</text>

    <SnText type="primary" bold>
      <template #prefix>
        <text class="sn-demo__tag">NEW</text>
      </template>
      default 插槽内容优先于 text
      <template #suffix>
        <text class="sn-demo__suffix">→</text>
      </template>
    </SnText>
    <text class="sn-demo__meta">prefix / suffix 插槽里放的是节点，不是字符串。</text>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-text 根节点上，因此这里需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__highlight) {
  display: block;
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__tag {
  margin-right: var(--sn-mp-spacing-1);
  padding: 0 var(--sn-mp-spacing-1);
  border-radius: var(--sn-mp-radius-xs);
  background-color: var(--sn-mp-color-feedback-danger-soft);
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__suffix {
  margin-left: var(--sn-mp-spacing-1);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
