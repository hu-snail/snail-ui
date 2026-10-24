<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — `customClass` / `customStyle`。
 *
 * 两个 prop 都落在 sn-icon 的根节点上：
 *
 *   - `customClass` 追加类名（字符串；组件内部是 `:class="[customClass]"`）
 *   - `customStyle` 与尺寸盒子合并 —— 字符串形式会整体写进根节点的 cssText，
 *     对象形式与 `width` / `height` 合并
 *
 * 因为 `customStyle` 字符串会覆盖尺寸盒子，这里刻意用它改 `color` 与
 * `background-color`，再用 `customClass` 加边框 / 内边距。
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import { Star, Heart, Settings } from '@snui/uni-src/components/sn-icon/sn-icon-set'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">customClass：追加根节点类名（虚线圆角框）</text>
    <view class="sn-demo__row">
      <SnIcon :icon="Star" :size="40" custom-class="sn-icon-demo--framed" />
      <SnIcon :icon="Heart" :size="40" custom-class="sn-icon-demo--framed" />
      <SnIcon :icon="Settings" :size="40" custom-class="sn-icon-demo--framed" />
    </view>

    <text class="sn-demo__meta">customStyle（字符串）：整体写入根节点样式，覆盖默认尺寸盒子</text>
    <view class="sn-demo__row">
      <SnIcon
        :icon="Star"
        :size="40"
        custom-style="color: var(--sn-mp-color-action-primary); padding: var(--sn-mp-spacing-1); background-color: var(--sn-mp-color-action-primary-soft); border-radius: var(--sn-mp-radius-full);"
      />
    </view>

    <text class="sn-demo__meta">两者叠加：customClass 加边框，customStyle 改颜色与底色</text>
    <view class="sn-demo__row">
      <SnIcon
        :icon="Heart"
        :size="48"
        custom-class="sn-icon-demo--framed"
        custom-style="color: var(--sn-mp-color-feedback-danger); background-color: var(--sn-mp-color-feedback-danger-soft);"
      />
    </view>

    <text class="sn-demo__meta">
      颜色也可以走 color prop；customStyle 只在需要 padding / 底色这类盒子属性时使用
    </text>
    <view class="sn-demo__row">
      <SnIcon :icon="Settings" :size="40" color="var(--sn-mp-color-feedback-success)" />
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
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* customClass 落在 sn-icon 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-icon-demo--framed) {
  box-sizing: content-box;
  padding: var(--sn-mp-spacing-1);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
}
</style>
