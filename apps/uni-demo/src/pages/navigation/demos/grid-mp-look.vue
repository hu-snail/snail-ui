<script setup lang="ts">
/**
 * Demo: sn-grid — 外观：bg-color / center / icon-size / custom-class / custom-style。
 *
 * - `bg-color` 内联覆盖宫格背景色（空串 = 令牌默认）
 * - `center` 控制格子内容是否居中（`false` 时贴顶对齐）
 * - `icon-size` 图标尺寸（数字按 px，字符串原样转发）
 * - `custom-class` / `custom-style` 落在根节点
 */
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">bg-color + icon-size=48px</text>
    <SnGrid :column="4" bg-color="var(--sn-mp-color-background-subtle)" icon-size="48px">
      <SnGridItem text="扫一扫" icon="camera" />
      <SnGridItem text="付款" icon="wallet" />
      <SnGridItem text="收款" icon="banknote" />
      <SnGridItem text="更多" icon="ellipsis" />
    </SnGrid>

    <text class="sn-demo__label">center=false + custom-class / custom-style</text>
    <SnGrid
      :column="3"
      border
      :center="false"
      custom-class="sn-demo__grid"
      custom-style="padding: var(--sn-mp-spacing-2);"
    >
      <SnGridItem text="顶对齐的格子" icon="star" />
      <SnGridItem text="第二格" icon="heart" />
      <SnGridItem text="第三格" icon="bell" />
    </SnGrid>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* custom-class 落在 sn-grid 根节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__grid) {
  border-radius: var(--sn-mp-radius-md);
}
</style>
