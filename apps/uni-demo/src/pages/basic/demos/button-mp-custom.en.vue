<script setup lang="ts">
/**
 * Demo: sn-button — `bgColor` / `color` / `loadingColor` / `loadingSize`
 * overrides, plus the two customisation entry points `customClass` /
 * `customStyle`.
 *
 * `bgColor` / `color` are inline overrides and win over the semantic type's
 * own token; `customClass` lands on the root node (pair it with `:deep()`),
 * and `customStyle` is an inline style that overrides the component's own
 * background / radius.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">bgColor + color: inline override of the semantic colours</text>
    <view class="sn-demo__row">
      <SnButton
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
      >
        bgColor + color
      </SnButton>
      <SnButton color="var(--sn-mp-color-action-info)" variant="plain">
        color border + text
      </SnButton>
    </view>

    <text class="sn-demo__meta">loading-color / loading-size change the spinner</text>
    <view class="sn-demo__row">
      <SnButton loading loading-color="var(--sn-mp-color-feedback-success)" type="primary">
        loading-color
      </SnButton>
      <SnButton loading loading-size="48" type="success">loading-size</SnButton>
    </view>

    <text class="sn-demo__meta">customClass adds a class / customStyle overrides inline</text>
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
