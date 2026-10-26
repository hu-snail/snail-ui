<script setup lang="ts">
/**
 * Demo: sn-sticky — `custom-class` / `custom-style` and stacked sticky layers.
 *
 * - `custom-class` / `custom-style` land on the root (which is itself
 *   `position: sticky`)
 * - increasing `offset-top` per layer produces a stacked header: the second layer
 *   pins below the first
 * - `z-index` decides the stacking order; the larger value wins
 */
import SnSticky from '@snui/uni-src/components/sn-sticky/sn-sticky.vue';
</script>

<template>
  <view class="sn-demo sn-demo--scroll">
    <scroll-view class="sn-demo__viewport" scroll-y>
      <view class="sn-demo__lead">Scroll down: two headers pin one after the other</view>

      <SnSticky
        :offset-top="0"
        :z-index="10"
        custom-class="sn-demo__layer-a"
        custom-style="background-color: var(--sn-mp-color-action-primary-soft);"
      >
        <view class="sn-demo__bar sn-demo__bar--a"><text>Layer 1 (offset-top=0)</text></view>
      </SnSticky>

      <view v-for="index in 6" :key="`a-${index}`" class="sn-demo__row">
        <text>Layer 1 content {{ index }}</text>
      </view>

      <SnSticky
        :offset-top="44"
        :z-index="20"
        custom-class="sn-demo__layer-b"
        custom-style="background-color: var(--sn-mp-color-background-subtle);"
      >
        <view class="sn-demo__bar sn-demo__bar--b"><text>Layer 2 (offset-top=44)</text></view>
      </SnSticky>

      <view v-for="index in 14" :key="`b-${index}`" class="sn-demo__row">
        <text>Layer 2 content {{ index }}</text>
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
/* custom-class lands on the sn-sticky root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__layer-a) {
  border-bottom: 2rpx solid var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__layer-b) {
  border-bottom: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
