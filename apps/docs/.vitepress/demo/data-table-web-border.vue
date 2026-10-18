<script setup lang="ts">
/** Demo: SnDataTable — bordered / bottom-bordered / single-line / single-column. */
import { SnDataTable } from '@snui/vue-web'
const columns = [
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
    <SnDataTable :columns="columns" :data="data" :bordered="false" />
    <SnDataTable :columns="columns" :data="data" :bordered="false" :single-line="false" />
    <SnDataTable :columns="columns" :data="data" :bordered="false" :single-column="true" />
    <SnDataTable :columns="columns" :data="data" :bordered="false" :bottom-bordered="false" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
}
</style>
