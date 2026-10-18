<script setup lang="ts">
/** Demo: SnDataTable — uncontrolled filter + sorter working together. */
import { SnDataTable } from '@snui/vue-web'
const columns = [
  {
    title: 'Name',
    key: 'name',
    defaultSortOrder: 'ascend',
    sorter: 'default',
  },
  {
    title: 'Age',
    key: 'age',
    sorter: (row1: Record<string, unknown>, row2: Record<string, unknown>) =>
      Number(row1.age) - Number(row2.age),
  },
  {
    title: 'Address',
    key: 'address',
    filter: 'default',
    defaultFilterOptionValues: ['London'],
    filterOptions: [
      { label: 'London', value: 'London' },
      { label: 'New York', value: 'New York' },
    ],
  },
]

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
  { key: 3, name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">
      Name 默认升序；点击 Address 表头的漏斗勾选城市后点「确认」过滤。
    </p>
    <SnDataTable :columns="columns" :data="data" :pagination="{ pageSize: 5 }" />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 720px; }
.sn-demo-tip { margin: 0 0 8px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
</style>
