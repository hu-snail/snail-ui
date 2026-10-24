<script setup lang="ts">
/**
 * Demo: sn-navbar — 禁用侧按钮、安全区、层级与自定义插槽。
 *
 * - `left-disabled` / `right-disabled` 让对应侧按钮点击无效（只 stopPropagation，
 *   不 emit `click-left` / `click-right`）
 * - `safe-area-inset-top` 把状态栏高度补成 padding-top
 * - `z-index` 只在 `fixed` 时生效
 * - `custom-class` / `custom-style` 落在根节点
 * - `capsule` 插槽占据左侧区（存在时 left 插槽与 left 文案都不渲染）
 */
import { ref } from 'vue'
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue'
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import { MoreHorizontal } from '@snui/uni-src/components/sn-icon/sn-icon-set'

const lastAction = ref('—')

function report(label: string): void {
  lastAction.value = label
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNavbar
      title="左右都禁用"
      left-text="返回"
      right-text="更多"
      left-disabled
      right-disabled
      @click-left="report('左侧（已禁用）')"
      @click-right="report('右侧（已禁用）')"
    />

    <SnNavbar title="安全区 + 层级" safe-area-inset-top :z-index="30" bordered />

    <SnNavbar
      title="自定义根节点"
      custom-class="sn-demo__bar"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    >
      <template #title>
        <view class="sn-demo__title">
          <text class="sn-demo__title-text">标题插槽</text>
        </view>
      </template>
      <template #capsule>
        <view class="sn-demo__capsule" @tap="report('胶囊插槽')">
          <SnIcon :icon="MoreHorizontal" :size="32" />
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">最近一次点击：{{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__title {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sn-demo__title-text {
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__capsule {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sn-mp-spacing-3);
  height: 56rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-text-secondary);
}
</style>
