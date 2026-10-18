<script setup lang="ts">
/** Demo: SnDataTable — striped zebra rows. */
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
  { key: 3, name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]
</script>

<template>
  <div class="sn-demo">
    <SnDataTable striped :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 640px; }
</style>
