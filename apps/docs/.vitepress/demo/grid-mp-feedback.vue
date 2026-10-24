<script setup lang="ts">
/**
 * Demo: sn-grid — 背景色、点击反馈、居中与图标尺寸。
 *
 * - `bg-color` 内联覆盖宫格背景色（空串 = 令牌默认）
 * - `clickable` 让每个格子可点并按 `hover-class` 给出按压反馈
 * - `hover-class` 指定格子按下时附加的类名（默认 `sn-grid-item__content--hover`）
 * - `center` 控制格子内容是否居中（`false` 时贴顶对齐）
 * - `icon-size` 图标尺寸（数字按 px，字符串原样转发）
 * - `custom-class` / `custom-style` 落在根节点
 */
import { ref } from 'vue'
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue'
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue'

const tapped = ref('—')

function onCellClick(payload: { url: string; linkType: string }): void {
  tapped.value = payload.url === '' ? '（无 url）' : payload.url
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">bg-color + clickable + icon-size=48px</text>
    <SnGrid
      :column="4"
      bg-color="var(--sn-mp-color-background-subtle)"
      clickable
      icon-size="48px"
      @click="onCellClick"
    >
      <SnGridItem text="扫一扫" icon="Search" />
      <SnGridItem text="付款" icon="Download" />
      <SnGridItem text="收款" icon="Upload" />
      <SnGridItem text="更多" icon="MoreHorizontal" />
    </SnGrid>

    <text class="sn-demo__label">hover-class 自定义 + center=false + custom-style</text>
    <SnGrid
      :column="3"
      border
      clickable
      :center="false"
      hover-class="sn-demo__cell-press"
      custom-class="sn-demo__grid"
      custom-style="padding: var(--sn-mp-spacing-2);"
      @click="onCellClick"
    >
      <SnGridItem text="顶对齐的格子" icon="Star" />
      <SnGridItem text="第二格" icon="Heart" />
      <SnGridItem text="第三格" icon="Bell" />
    </SnGrid>

    <text class="sn-demo__meta">最近点击：{{ tapped }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* custom-class 落在 sn-grid 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__grid) {
  border-radius: var(--sn-mp-radius-md);
}
/* hover-class 由 sn-grid 透传到每个格子，类名本身定义在 demo 里。 */
.sn-demo :deep(.sn-demo__cell-press) {
  background-color: var(--sn-mp-color-action-primary-soft);
}
</style>
