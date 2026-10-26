<script setup lang="ts">
/** Demo: SnDataTable — ellipsis cells (native title fallback). */
import { SnDataTable } from '@snui/vue-web';

const columns = [
  {
    title: 'Name',
    key: 'name',
    width: 120,
    ellipsis: true,
  },
  {
    title: 'Address',
    key: 'address',
    ellipsis: true,
  },
];

const data = [
  {
    key: 0,
    name: 'Edward King IV',
    address: 'New York No. 1 Lake Park, a very long address that overflows the cell width',
  },
  {
    key: 1,
    name: 'Jim Green',
    address: 'London No. 1 Lake Park, another overflowing address for the demo',
  },
];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">悬停省略单元格可看到原生 title 提示（tooltip 浮层为 future marker）。</p>
    <SnDataTable :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
.sn-demo-tip {
  margin: 0 0 24px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}
</style>
