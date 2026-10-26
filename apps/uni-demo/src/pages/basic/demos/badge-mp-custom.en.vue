<script setup lang="ts">
/**
 * Demo: sn-badge (uni-end) — `customClass` / `customStyle`.
 *
 * Both props land on the sn-badge root node (the wrapper), not on the marker:
 *
 *   - `customClass` appends a root class (in the `rootClass` array)
 *   - `customStyle` becomes the root inline style
 *
 * The marker's own fill / offset still come from `type` / `bgColor` / `top` /
 * `right`. The demo uses customClass for a dashed frame on the wrapper and
 * customStyle for padding and alignment.
 */
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';

const items = [
  { value: 3, label: 'three' },
  { value: 12, label: 'twelve' },
  { value: 120, label: 'hundred' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">customClass: appends a wrapper class (dashed frame + padding)</text>
    <view class="sn-demo__row">
      <SnBadge
        v-for="item in items"
        :key="item.label"
        :value="item.value"
        :max="99"
        custom-class="sn-badge-demo--framed"
      >
        <view class="sn-badge-demo__host">{{ item.value }}</view>
      </SnBadge>
    </view>

    <text class="sn-demo__meta">customStyle: writes the wrapper's inline style</text>
    <view class="sn-demo__row">
      <SnBadge
        :value="8"
        custom-style="padding: var(--sn-mp-spacing-2); border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-subtle);"
      >
        <view class="sn-badge-demo__host">8</view>
      </SnBadge>
    </view>

    <text class="sn-demo__meta"
      >Both together: customClass adds the frame, customStyle adds padding and fill</text
    >
    <view class="sn-demo__row">
      <SnBadge
        is-dot
        custom-class="sn-badge-demo--framed"
        custom-style="padding: var(--sn-mp-spacing-2);"
      >
        <view class="sn-badge-demo__host">dot</view>
      </SnBadge>
    </view>

    <text class="sn-demo__meta"
      >The marker itself (type / bgColor / top / right) is untouched by these two props</text
    >
    <view class="sn-demo__row">
      <SnBadge
        :value="6"
        type="primary"
        bg-color="var(--sn-mp-color-purple)"
        :top="6"
        :right="6"
        custom-class="sn-badge-demo--framed"
      >
        <view class="sn-badge-demo__host">6</view>
      </SnBadge>
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
  gap: 32rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-badge-demo__host {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
/* customClass lands on the sn-badge root node (the wrapper). */
.sn-demo :deep(.sn-badge-demo--framed) {
  padding: var(--sn-mp-spacing-1);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
