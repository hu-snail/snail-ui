<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — index column (`index`).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue';
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue';

interface Row {
  name: string;
  amount: number;
  status: string;
}

const baseRows: Row[] = [
  { name: 'Snail A', amount: 128, status: 'Paid' },
  { name: 'Snail B', amount: 256, status: 'Pending' },
  { name: 'Snail C', amount: 64, status: 'Paid' },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="baseRows" index>
      <SnTableColumn prop="name" label="Name" :width="150" />
      <SnTableColumn prop="amount" label="Amount" :width="110" align="right" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center" />
    </SnTable>
    <text class="sn-demo__meta">index turns on the leading number column (default header "No.").</text>
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
