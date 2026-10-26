<script setup lang="ts">
/**
 * Demo: sn-tabbar — fixed bottom bar, placeholder, safe area and z-index.
 *
 * - `fixed` pins the bar to the bottom of the page (`position: fixed`); `z-index`
 *   only applies in that mode
 * - `placeholder` renders an equal-height spacer in fixed mode so page content is
 *   not hidden behind the bar
 * - `safe-area-inset-bottom` adds `env(safe-area-inset-bottom)` as bottom padding
 *   (the browser preview resolves it to 0; only notched devices get real height)
 *
 * Docs-preview only: in the real runtime the root is `position: fixed` and would
 * cover the whole page; `custom-class` lands on the root, so the preview pins the
 * bar to the bottom of this stage instead.
 */
import { ref } from 'vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';

const active = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__hint">fixed + placeholder + safe-area-inset-bottom + z-index=40</text>

      <SnTabbar
        v-model="active"
        fixed
        placeholder
        safe-area-inset-bottom
        :z-index="40"
        custom-class="sn-demo-contained"
      >
        <SnTabbarItem title="Home" icon="Home" />
        <SnTabbarItem title="Discover" icon="Search" />
        <SnTabbarItem title="Me" icon="User" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">Active index: {{ active }}</text>
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 480rpx;
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-sunken);
}
.sn-demo__hint {
  padding: var(--sn-mp-spacing-4);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed bar to the stage instead of the viewport. */
.sn-demo__stage :deep(.sn-tabbar.sn-demo-contained) {
  position: absolute;
}
</style>
