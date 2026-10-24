<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — basic table, index column, sorting, fixed header.
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
  { name: 'Snail A', amount: 128, status: 'Paid' },
  { name: 'Snail B', amount: 256, status: 'Pending' },
  { name: 'Snail C', amount: 64, status: 'Paid' },
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
      <SnTableColumn prop="name" label="Name" :width="150" />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" sortable />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">With the index column; tap the Amount header to cycle ascending / descending / unsorted.</text>

    <SnTable :data="baseRows" :height="180" fixed-header>
      <SnTableColumn prop="name" label="Name" :width="150" fixed />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">Fixed height + pinned header + a left-pinned first column (stays visible while scrolling sideways).</text>
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
