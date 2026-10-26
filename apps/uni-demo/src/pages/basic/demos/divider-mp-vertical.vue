<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — vertical 垂直分割线 + custom-class / custom-style。
 *
 * `vertical` 与 `direction="vertical"` 是同一个轴，两种写法等价。
 * 垂直分割线默认 `height: 1em`（跟随当前行高），需要更高时用
 * custom-class / custom-style 覆盖 —— 这两个 prop 落在根节点上。
 */
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <text class="sn-demo__word">编辑</text>
      <SnDivider vertical />
      <text class="sn-demo__word">复制</text>
      <SnDivider vertical />
      <text class="sn-demo__word">删除</text>
    </view>
    <text class="sn-demo__meta">vertical 简写（默认 1em 高，随行高）</text>

    <view class="sn-demo__row">
      <text class="sn-demo__word">方向</text>
      <SnDivider direction="vertical" dashed />
      <text class="sn-demo__word">vertical 虚线</text>
      <SnDivider direction="vertical" color="var(--sn-mp-color-action-primary)" />
      <text class="sn-demo__word">自定义颜色</text>
    </view>
    <text class="sn-demo__meta"
      >direction="vertical" 与 vertical 等价；dashed / color 同样适用</text
    >

    <view class="sn-demo__row sn-demo__row--tall">
      <text class="sn-demo__word">custom-class</text>
      <SnDivider vertical custom-class="sn-demo__tall-divider" />
      <text class="sn-demo__word">custom-style</text>
      <SnDivider vertical custom-style="height: 64rpx;" />
      <text class="sn-demo__word">更高的分割线</text>
    </view>
    <text class="sn-demo__meta">custom-class / custom-style 落在根节点，可覆盖默认 height</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8rpx;
  width: 100%;
}
.sn-demo__row--tall {
  min-height: 96rpx;
}
.sn-demo__word {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-divider 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__tall-divider) {
  height: 64rpx;
  border-left-color: var(--sn-mp-color-action-primary);
}
</style>
