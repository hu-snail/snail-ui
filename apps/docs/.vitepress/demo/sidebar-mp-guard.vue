<script setup lang="ts">
/**
 * Demo: sn-sidebar — `before-change` 拦截与 `select` 方法。
 *
 * - `before-change` 在切换前调用，返回 `false`（或 reject 的 Promise）时阻止切换
 * - 通过模板 ref 调 `select(value, label)` 可从代码驱动侧边栏
 * - `sn-sidebar-item` 的 `max` 控制徽标上限（超过显示 `{max}+`）
 * - `custom-class` / `custom-style` 落在根节点
 */
import { ref } from 'vue'
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue'
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue'

const active = ref(0)
const blocked = ref(0)

const labels = ['全部', '待付款', '待发货', '已完成']

/** 前两次切换被拦下，第三次放行。 */
function beforeChange(): boolean {
  blocked.value += 1
  return blocked.value > 2
}

const sidebarRef = ref<InstanceType<typeof SnSidebar> | null>(null)

function jumpTo(index: number): void {
  sidebarRef.value?.select(index, labels[index] ?? '')
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnSidebar
        ref="sidebarRef"
        v-model="active"
        :before-change="beforeChange"
        custom-class="sn-demo__side"
      >
        <SnSidebarItem
          v-for="(label, index) in labels"
          :key="label"
          :label="label"
          :value="index"
          :badge="index === 1 ? 120 : undefined"
          :max="99"
        />
      </SnSidebar>
      <view class="sn-demo__panel">
        <text class="sn-demo__panel-text">当前：{{ labels[active] }}</text>
        <text class="sn-demo__meta">已拦截 {{ Math.min(blocked, 2) }} 次</text>
      </view>
    </view>

    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="jumpTo(2)">select(2) 跳到「待发货」</text>
      <text class="sn-demo__button" @tap="blocked = 0">重置拦截计数</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  width: 100%;
  min-height: 400rpx;
}
.sn-demo__panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__panel-text {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
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
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* custom-class 落在 sn-sidebar 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__side) {
  flex: 0 0 180rpx;
}
</style>
