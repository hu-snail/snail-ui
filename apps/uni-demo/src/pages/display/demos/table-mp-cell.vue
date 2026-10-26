<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — 空态、斑马纹、省略与自定义单元格。
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
  { name: '蜗牛 A', note: '这是一段很长的备注，用来演示两行省略的效果。', status: '正常' },
  { name: '蜗牛 B', note: '短备注', status: '异常' },
];

const emptyRows: Row[] = [];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="rows" ellipsis>
      <SnTableColumn prop="name" label="名称" :width="140" />
      <SnTableColumn prop="note" label="备注" :width="260" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center">
        <template #value="{ row }">
          <SnTag :type="row.status === '正常' ? 'success' : 'danger'" size="small">
            {{ row.status }}
          </SnTag>
        </template>
      </SnTableColumn>
    </SnTable>
    <text class="sn-demo__meta">`ellipsis` 两行省略；状态列用 `value` 插槽渲染 sn-tag。</text>

    <SnTable :data="emptyRows">
      <SnTableColumn prop="name" label="名称" />
    </SnTable>
    <text class="sn-demo__meta">空数据时的内置空态行。</text>
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
