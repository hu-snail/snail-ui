<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — 基础表格 + 索引列 + 排序 + 固定表头。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import { computed, ref } from 'vue'
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue'
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue'

interface Row {
  name: string
  amount: number
  status: string
}

const baseRows: Row[] = [
  { name: '蜗牛 A', amount: 128, status: '已付款' },
  { name: '蜗牛 B', amount: 256, status: '待付款' },
  { name: '蜗牛 C', amount: 64, status: '已付款' },
]

const order = ref<'none' | 'asc' | 'desc'>('none')

const sortedRows = computed(() => {
  if (order.value === 'none') return baseRows
  const sorted = [...baseRows].sort((a, b) => a.amount - b.amount)
  return order.value === 'asc' ? sorted : sorted.reverse()
})

function onSort(payload: { prop: string; order: 'none' | 'asc' | 'desc' }) {
  if (payload.prop === 'amount') order.value = payload.order
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="sortedRows" index @sort-method="onSort">
      <SnTableColumn prop="name" label="名称" :width="150" />
      <SnTableColumn prop="amount" label="金额" :width="110" align="right" sortable />
      <SnTableColumn prop="status" label="状态" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">带索引列；点「金额」表头切换升序 / 降序 / 取消排序。</text>

    <SnTable :data="baseRows" :height="180" fixed-header>
      <SnTableColumn prop="name" label="名称" :width="150" fixed />
      <SnTableColumn prop="amount" label="金额" :width="110" align="right" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">固定高度 + 固定表头 + 首列左固定（横向滚动时保持可见）。</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
</style>
