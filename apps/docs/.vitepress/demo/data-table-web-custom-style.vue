<script setup lang="ts">
/** Demo: SnDataTable — column className for custom cell styling. */
import { SnDataTable } from '@snui/vue-web'

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age', className: 'sn-demo-age-col' },
  { title: 'Address', key: 'address' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
]
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 640px; }
.sn-demo :deep(.sn-demo-age-col) {
  color: var(--sn-web-color-action-primary);
  font-variant-numeric: tabular-nums;
}
</style>
