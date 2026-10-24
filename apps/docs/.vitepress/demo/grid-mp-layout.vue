<script setup lang="ts">
/** Demo: sn-grid — 列数、间距、正方形与横向排列。 */
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue'
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnGrid :column="4" :gutter="16" square clickable>
      <SnGridItem text="扫一扫" icon="Search" />
      <SnGridItem text="付款" icon="Download" />
      <SnGridItem text="收款" icon="Upload" />
      <SnGridItem text="更多" icon="MoreHorizontal" />
    </SnGrid>
    <SnGrid :column="2" :gutter="12" direction="horizontal" :reverse="true">
      <SnGridItem text="横向排列" icon="Star" />
      <SnGridItem text="图标在后" icon="Heart" />
    </SnGrid>
    <text class="sn-demo__meta">4 列 + 间距 + 正方形；横向排列并反转图标位置</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
