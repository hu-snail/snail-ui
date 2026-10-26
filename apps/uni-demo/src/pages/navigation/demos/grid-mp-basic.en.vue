<script setup lang="ts">
/** Demo: sn-grid — basic icon grid. */
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnGrid :column="3" border>
      <SnGridItem text="Home" icon="Home" />
      <SnGridItem text="Search" icon="Search" />
      <SnGridItem text="Messages" icon="Bell" :value="12" />
      <SnGridItem text="Starred" icon="Star" />
      <SnGridItem text="Settings" icon="Settings" />
      <SnGridItem text="More" icon="MoreHorizontal" />
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
