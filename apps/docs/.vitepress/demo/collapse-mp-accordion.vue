<script setup lang="ts">
/** Demo: sn-collapse — 手风琴模式与禁用项。 */
import { ref } from 'vue'
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue'
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue'

const open = ref('a')
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCollapse v-model="open" accordion>
      <SnCollapseItem name="a" title="常见问题">同时只展开一项。</SnCollapseItem>
      <SnCollapseItem name="b" title="售后政策">7 天无理由退换。</SnCollapseItem>
      <SnCollapseItem name="c" title="暂不可用" disabled>该面板已禁用。</SnCollapseItem>
    </SnCollapse>
    <text class="sn-demo__meta">当前展开：{{ open || '无' }}</text>
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
