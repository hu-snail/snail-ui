<script setup lang="ts">
/**
 * Demo: sn-table (uni-end) — 自定义单元格（value 插槽）。
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
  { name: '蜗牛 A', status: '正常' },
  { name: '蜗牛 B', status: '异常' },
];
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnTable :data="rows">
      <SnTableColumn prop="name" label="名称" :width="140" />
      <SnTableColumn prop="status" label="状态" :width="120" align="center">
        <template #value="{ row }">
          <SnTag :type="row.status === '正常' ? 'success' : 'danger'" size="small">
            {{ row.status }}
          </SnTag>
        </template>
      </SnTableColumn>
    </SnTable>
    <text class="sn-demo__meta">状态列用 `value` 插槽渲染 sn-tag，替代纯文本。</text>
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
