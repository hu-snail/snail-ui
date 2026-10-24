<script setup lang="ts">
/**
 * Demo: sn-index-bar — `scrollTo()` 代码跳转与自定义根节点样式。
 *
 * - 模板 ref 上的 `scrollTo(index)` 可从代码跳转到某个分组（同时 emit `change`）
 * - `custom-class` / `custom-style` 落在根节点
 * - `sticky` 目前只在根节点切换 `sn-index-bar--sticky` 类，没有配套样式规则，
 *   因此不传它 —— 该 prop 属于契约位，视觉差异见文档说明
 *
 * 预览里 `sn-demo--index` 让 demo 铺满整屏（见 PhoneFrame 的 full-bleed 规则）。
 */
import { ref } from 'vue'
import SnIndexBar from '@snui/uni-src/components/sn-index-bar/sn-index-bar.vue'
import SnIndexAnchor from '@snui/uni-src/components/sn-index-bar/sn-index-anchor.vue'

const barRef = ref<InstanceType<typeof SnIndexBar> | null>(null)

const groups = [
  { index: 'A', names: ['Alice', 'Amy', 'Aaron'] },
  { index: 'B', names: ['Bob', 'Bella', 'Ben'] },
  { index: 'C', names: ['Carl', 'Cindy'] },
  { index: 'D', names: ['Dora'] },
]

function jumpTo(index: string): void {
  barRef.value?.scrollTo(index)
}
</script>

<template>
  <view class="sn-demo sn-demo--index">
    <SnIndexBar
      ref="barRef"
      custom-class="sn-demo__bar"
      custom-style="background-color: var(--sn-mp-color-background-surface);"
    >
      <SnIndexAnchor v-for="group in groups" :key="group.index" :index="group.index">
        <view v-for="name in group.names" :key="name" class="sn-demo__row">
          <text>{{ name }}</text>
        </view>
      </SnIndexAnchor>
    </SnIndexBar>

    <view class="sn-demo__jump">
      <text
        v-for="group in groups"
        :key="`jump-${group.index}`"
        class="sn-demo__chip"
        @tap="jumpTo(group.index)"
      >
        {{ group.index }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--index {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 420rpx;
  overflow: hidden;
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__jump {
  display: flex;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}
.sn-demo__chip {
  padding: 0 var(--sn-mp-spacing-2);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  font-size: 22rpx;
  color: var(--sn-mp-color-action-primary);
}
/* custom-class 落在 sn-index-bar 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__bar) {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
