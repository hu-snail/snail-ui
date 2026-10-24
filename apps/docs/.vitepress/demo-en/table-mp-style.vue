<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — border / stripe / show-header / index config / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue'
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue'

interface Row {
  name: string
  amount: number
  status: string
}

const rows: Row[] = [
  { name: 'Snail A', amount: 128, status: 'Paid' },
  { name: 'Snail B', amount: 256, status: 'Pending' },
  { name: 'Snail C', amount: 64, status: 'Paid' },
  { name: 'Snail D', amount: 512, status: 'Refunded' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTable
      :data="rows"
      border
      stripe
      :index="{ label: 'No.', width: 90, align: 'center' }"
      custom-class="sn-table-demo__root"
      custom-style="margin-bottom: 8rpx"
    >
      <SnTableColumn prop="name" label="Name" :width="150" />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">
      border + stripe enable cell borders and zebra rows; an index object customises the index column's label / width
      / alignment; customClass / customStyle apply to the table root.
    </text>

    <SnTable :data="rows" :border="false" :stripe="false">
      <SnTableColumn prop="name" label="Name" :width="150" />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">border=false + stripe=false: a light list without borders or zebra rows.</text>

    <SnTable :data="rows" :show-header="false">
      <SnTableColumn prop="name" label="Name" :width="150" />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">show-header=false hides the header row, leaving the body only.</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-table-demo__root) {
  box-shadow: var(--sn-mp-shadow-sm);
}
</style>
