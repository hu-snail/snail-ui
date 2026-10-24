<script setup lang="ts">
/**
 * Demo: sn-sticky — `custom-class` / `custom-style` 与多层吸顶。
 *
 * - `custom-class` / `custom-style` 落在根节点（sticky 根节点本身是 `position: sticky`）
 * - `offset-top` 逐层递增可实现多层吸顶：第二层用更大的偏移
 * - `z-index` 决定层级，数值大的盖在上面
 */
import SnSticky from '@snui/uni-src/components/sn-sticky/sn-sticky.vue'
</script>

<template>
  <view class="sn-demo sn-demo--scroll">
    <scroll-view class="sn-demo__viewport" scroll-y>
      <view class="sn-demo__lead">向下滚动：两层标题依次吸顶</view>

      <SnSticky
        :offset-top="0"
        :z-index="10"
        custom-class="sn-demo__layer-a"
        custom-style="background-color: var(--sn-mp-color-action-primary-soft);"
      >
        <view class="sn-demo__bar sn-demo__bar--a"><text>第一层（offset-top=0）</text></view>
      </SnSticky>

      <view v-for="index in 6" :key="`a-${index}`" class="sn-demo__row">
        <text>第一层内容 {{ index }}</text>
      </view>

      <SnSticky
        :offset-top="44"
        :z-index="20"
        custom-class="sn-demo__layer-b"
        custom-style="background-color: var(--sn-mp-color-background-subtle);"
      >
        <view class="sn-demo__bar sn-demo__bar--b"><text>第二层（offset-top=44）</text></view>
      </SnSticky>

      <view v-for="index in 14" :key="`b-${index}`" class="sn-demo__row">
        <text>第二层内容 {{ index }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.sn-demo--scroll {
  width: 100%;
}
.sn-demo__viewport {
  height: 480rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-sm);
}
.sn-demo__lead {
  padding: var(--sn-mp-spacing-3);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__bar {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  font-size: 24rpx;
}
.sn-demo__bar--a {
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__bar--b {
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* custom-class 落在 sn-sticky 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__layer-a) {
  border-bottom: 2rpx solid var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__layer-b) {
  border-bottom: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
