<script setup lang="ts">
/** Demo: sn-grid — 基础宫格。 */
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue'
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnGrid :column="3" border>
      <SnGridItem text="首页" icon="Home" />
      <SnGridItem text="搜索" icon="Search" />
      <SnGridItem text="消息" icon="Bell" :value="12" />
      <SnGridItem text="收藏" icon="Star" />
      <SnGridItem text="设置" icon="Settings" />
      <SnGridItem text="更多" icon="MoreHorizontal" />
    </SnGrid>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
