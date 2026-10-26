<script setup lang="ts">
/** Demo: SnDataTable — scroll-x with sticky left/right fixed columns. */
import { SnDataTable } from '@snui/vue-web';

const columns = [
  { title: 'Name', key: 'name', width: 150, fixed: 'left' as const },
  { title: 'Age', key: 'age', width: 100 },
  { title: 'Column 1', key: 'c1', width: 160 },
  { title: 'Column 2', key: 'c2', width: 160 },
  { title: 'Column 3', key: 'c3', width: 160 },
  { title: 'Column 4', key: 'c4', width: 160 },
  { title: 'Address', key: 'address', width: 200, fixed: 'right' as const },
];

const data = Array.from({ length: 8 }).map((_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  age: 32,
  c1: `Data ${index}-1`,
  c2: `Data ${index}-2`,
  c3: `Data ${index}-3`,
  c4: `Data ${index}-4`,
  address: `London, Park Lane no. ${index}`,
}));
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" :scroll-x="1090" :max-height="240" />
  </div>
</template>

<style scoped></style>
