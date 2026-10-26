<script setup lang="ts">
/**
 * Demo: sn-badge (uni-end) — `customClass` / `customStyle`。
 *
 * 两个 prop 都落在 sn-badge 的根节点（包裹容器）上，不是角标节点：
 *
 *   - `customClass` 追加根节点类名（`rootClass` 数组里）
 *   - `customStyle` 直接作为根节点 inline style
 *
 * 角标本身的底色 / 位置仍由 `type` / `bgColor` / `top` / `right` 控制。
 * 这里用 customClass 给包裹容器加虚线框，用 customStyle 加内边距与对齐。
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
    <text class="sn-demo__meta">customClass：包裹容器追加类名（虚线框 + 内边距）</text>
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

    <text class="sn-demo__meta">customStyle：写包裹容器的 inline style</text>
    <view class="sn-demo__row">
      <SnBadge
        :value="8"
        custom-style="padding: var(--sn-mp-spacing-2); border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-subtle);"
      >
        <view class="sn-badge-demo__host">8</view>
      </SnBadge>
    </view>

    <text class="sn-demo__meta">两者叠加：customClass 加边框，customStyle 加内边距与底色</text>
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
      >角标自身的外观（type / bgColor / top / right）不受这两个 prop 影响</text
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
/* customClass 落在 sn-badge 根节点（包裹容器）上。 */
.sn-demo :deep(.sn-badge-demo--framed) {
  padding: var(--sn-mp-spacing-1);
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
