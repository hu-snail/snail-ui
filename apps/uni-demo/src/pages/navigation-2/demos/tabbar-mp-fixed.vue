<script setup lang="ts">
/**
 * Demo: sn-tabbar — 固定底部、占位元素、安全区与层级。
 *
 * - `fixed` 让标签栏贴到页面底部（`position: fixed`），`z-index` 只在这时生效
 * - `placeholder` 在固定模式下渲染一个等高占位元素，页面内容不会被栏遮住
 * - `safe-area-inset-bottom` 用 `env(safe-area-inset-bottom)` 补底部安全区
 *   （浏览器预览里该值为 0，真机刘海屏才有高度）
 *
 * 预览专用：真实运行时的根节点是 `position: fixed`，会盖住整页；
 * `custom-class` 落到根节点，把预览里的栏固定到这块 stage 的底部。
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
        <SnTabbarItem title="首页" icon="Home" />
        <SnTabbarItem title="发现" icon="Search" />
        <SnTabbarItem title="我的" icon="User" />
      </SnTabbar>
    </view>

    <text class="sn-demo__meta">当前索引：{{ active }}</text>
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
