<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — empty state.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue';
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue';

interface Row {
  name: string;
}

const emptyRows: Row[] = [];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="emptyRows">
      <SnTableColumn prop="name" label="Name" />
    </SnTable>
    <text class="sn-demo__meta">The built-in empty row when there is no data.</text>
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
