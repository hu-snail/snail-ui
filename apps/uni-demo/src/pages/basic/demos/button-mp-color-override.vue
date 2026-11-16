<script setup lang="ts">
/**
 * Demo: sn-button — `bgColor` / `color` 内联颜色覆盖。
 *
 * `bgColor` / `color` 是内联覆盖，优先级高于语义类型自带的 token；
 * `customClass` 落在根节点（配合 `:deep()` 追加样式），
 * `customStyle` 是内联 style，会覆盖组件自身的背景 / 圆角。
 *
 * 布局说明：uni-app x 不支持 flex `gap`，间距用内联 `custom-style` margin
 * 兜底，显式 `flex-direction: row` 抵消 uni-app x 的 column 默认值。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** 行内按钮间距（uni-app x 无 gap 兜底）。 */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-meta">bgColor + color：内联覆盖语义色</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
      >
        自定义背景与文字色
      </SnButton>
      <SnButton :custom-style="rowGap" color="var(--sn-mp-color-action-info)" variant="plain">
        自定义文字色（描边）
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">customClass 追加类名 / customStyle 内联覆盖</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" custom-class="my-mp-cta" type="primary">自定义类名</SnButton>
      <SnButton
        :custom-style="{ ...rowGap, 'border-radius': '999rpx', padding: '0 40rpx' }"
        type="warning"
      >
        自定义样式
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
:deep(.my-mp-cta) {
  letter-spacing: 4rpx;
}
</style>
