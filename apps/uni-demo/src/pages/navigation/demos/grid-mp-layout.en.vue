<script setup lang="ts">
/** Demo: sn-grid — column count, gutter, square cells and horizontal flow. */
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnGrid :column="4" :gutter="16" square clickable>
      <SnGridItem text="Scan" icon="Search" />
      <SnGridItem text="Pay" icon="Download" />
      <SnGridItem text="Receive" icon="Upload" />
      <SnGridItem text="More" icon="MoreHorizontal" />
    </SnGrid>
    <SnGrid :column="2" :gutter="12" direction="horizontal" :reverse="true">
      <SnGridItem text="Horizontal" icon="Star" />
      <SnGridItem text="Icon last" icon="Heart" />
    </SnGrid>
    <text class="sn-demo__meta"
      >4 columns with gutter and square cells; horizontal flow with reversed icon order</text
    >
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
