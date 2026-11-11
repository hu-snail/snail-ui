<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — custom cells (`value` slot).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue';
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

interface Row {
  name: string;
  status: string;
}

const rows: Row[] = [
  { name: 'Snail A', status: 'OK' },
  { name: 'Snail B', status: 'Error' },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="rows">
      <SnTableColumn prop="name" label="Name" :width="140" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center">
        <template #value="{ row }">
          <SnTag :type="row.status === 'OK' ? 'success' : 'danger'" size="small">
            {{ row.status }}
          </SnTag>
        </template>
      </SnTableColumn>
    </SnTable>
    <text class="sn-demo__meta">The status column renders an sn-tag through the `value` slot.</text>
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
