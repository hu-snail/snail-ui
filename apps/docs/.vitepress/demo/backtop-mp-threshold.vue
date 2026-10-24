<script setup lang="ts">
/**
 * Demo: sn-backtop — `top` 阈值、`icon-style`、`z-index` 与 `custom-class`。
 *
 * - `top` 是显示阈值（px），`scroll-top` 由宿主提供
 * - `icon-style` 追加在图标内联样式之后（默认已 `rotate(-90deg)` 指向上方）
 * - `z-index` 只在按钮可见时参与根节点定位样式
 * - `custom-class` / `custom-style` 落在根节点
 *
 * 预览专用：根节点是 `position: fixed`，`custom-class` 把它固定到这块 stage 内。
 */
import { ref } from 'vue'
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue'

const scrollTop = ref(0)
const clicks = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__meta">阈值 top=120，当前 scroll-top={{ scrollTop }}</text>

      <view class="sn-demo__actions">
        <text class="sn-demo__button" @tap="scrollTop = 80">80（低于阈值，隐藏）</text>
        <text class="sn-demo__button" @tap="scrollTop = 200">200（超过阈值，显示）</text>
        <text class="sn-demo__button" @tap="scrollTop = 0">归零</text>
      </view>

      <SnBacktop
        :scroll-top="scrollTop"
        :top="120"
        :z-index="30"
        icon-style="color: var(--sn-mp-color-action-primary);"
        text="顶部"
        custom-class="sn-demo-contained"
        @click="clicks += 1"
      />
    </view>

    <text class="sn-demo__meta">点击次数：{{ clicks }}</text>
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  height: 480rpx;
  padding: var(--sn-mp-spacing-4);
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 22rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — pin the fixed button to the stage. */
.sn-demo__stage :deep(.sn-backtop.sn-demo-contained) {
  position: absolute;
}
</style>
