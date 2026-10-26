<script setup lang="ts">
/**
 * Demo: sn-button — `bgColor` / `color` / `loadingColor` / `loadingSize` 覆盖，
 * 以及 `customClass` / `customStyle` 两种自定义入口。
 *
 * `bgColor` / `color` 是内联覆盖，优先级高于语义类型自带的 token；
 * `customClass` 落在根节点（配合 `:deep()` 追加样式），
 * `customStyle` 是内联 style，会覆盖组件自身的背景 / 圆角。
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">bgColor + color：内联覆盖语义色</text>
    <view class="sn-demo__row">
      <SnButton
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
      >
        bgColor + color
      </SnButton>
      <SnButton color="var(--sn-mp-color-action-info)" variant="plain">
        color 描边 + 文字
      </SnButton>
    </view>

    <text class="sn-demo__meta">loading-color / loading-size 改 spinner</text>
    <view class="sn-demo__row">
      <SnButton loading loading-color="var(--sn-mp-color-feedback-success)" type="primary">
        loading-color
      </SnButton>
      <SnButton loading loading-size="48" type="success">loading-size</SnButton>
    </view>

    <text class="sn-demo__meta">customClass 追加类名 / customStyle 内联覆盖</text>
    <view class="sn-demo__row">
      <SnButton custom-class="my-mp-cta" type="primary">customClass</SnButton>
      <SnButton :custom-style="{ 'border-radius': '999rpx', padding: '0 40rpx' }" type="warning">
        customStyle
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
:deep(.my-mp-cta) {
  letter-spacing: 4rpx;
}
</style>
