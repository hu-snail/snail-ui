<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — empty state, stripes, ellipsis and custom cells.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-table from its SFC source.
 */
import SnTable from '@snui/uni-src/components/sn-table/sn-table.vue';
import SnTableColumn from '@snui/uni-src/components/sn-table/sn-table-column.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

interface Row {
  name: string;
  note: string;
  status: string;
}

const rows: Row[] = [
  {
    name: 'Snail A',
    note: 'A deliberately long note so the two-line ellipsis is visible.',
    status: 'OK',
  },
  { name: 'Snail B', note: 'Short note', status: 'Error' },
];

const emptyRows: Row[] = [];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="rows" ellipsis>
      <SnTableColumn prop="name" label="Name" :width="140" />
      <SnTableColumn prop="note" label="Note" :width="260" />
      <SnTableColumn prop="status" label="Status" :width="120" align="center">
        <template #value="{ row }">
          <SnTag :type="row.status === 'OK' ? 'success' : 'danger'" size="small">
            {{ row.status }}
          </SnTag>
        </template>
      </SnTableColumn>
    </SnTable>
    <text class="sn-demo__meta"
      >`ellipsis` clamps to two lines; the status column renders an sn-tag through the `value`
      slot.</text
    >

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
