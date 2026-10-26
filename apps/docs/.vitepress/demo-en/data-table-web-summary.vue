<script setup lang="ts">
/** Demo: SnDataTable — summary row with colSpan below the body. */
import { SnDataTable } from '@snui/vue-web';

const columns = [
  { type: 'selection' },
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
];

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
];

function createSummary(pageData: Array<Record<string, unknown>>) {
  const totalAge = pageData.reduce((sum, row) => sum + Number(row.age ?? 0), 0);
  return {
    name: { value: `Total age: ${totalAge}`, colSpan: 3 },
  };
}
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" :summary="createSummary" />
  </div>
</template>

<style scoped></style>
