<script setup lang="ts">
/** Demo: SnDataTable — expandable rows with default-expanded keys. */
import { SnDataTable } from '@snui/vue-web'

const columns = [
  { type: 'expand', renderExpand: (row: Record<string, unknown>) => `${String(row.name)} 是一位不错的同事。` },
  { title: '#', key: 'key' },
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
]
</script>

<template>
  <div class="sn-demo">
    <SnDataTable
      :columns="columns"
      :data="data"
      :pagination="{ pageSize: 10 }"
      :default-expanded-row-keys="[1]"
    />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 720px; }
</style>
