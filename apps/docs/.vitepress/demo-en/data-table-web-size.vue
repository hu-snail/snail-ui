<script setup lang="ts">
/** Demo: SnDataTable — small / medium / large sizes. */
import { SnDataTable } from '@snui/vue-web';
const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
];

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
];
</script>

<template>
  <div class="sn-demo">
    <SnDataTable size="small" :columns="columns" :data="data" />
    <SnDataTable size="medium" :columns="columns" :data="data" />
    <SnDataTable size="large" :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
