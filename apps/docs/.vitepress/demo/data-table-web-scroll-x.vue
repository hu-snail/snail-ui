<script setup lang="ts">
/** Demo: SnDataTable — scroll-x horizontal scrolling container. */
import { SnDataTable } from '@snui/vue-web';

const columns = [
  { title: 'Name', key: 'name', width: 150 },
  { title: 'Column A', key: 'a', width: 200 },
  { title: 'Column B', key: 'b', width: 200 },
  { title: 'Column C', key: 'c', width: 200 },
  { title: 'Address', key: 'address', width: 260 },
];

const data = Array.from({ length: 5 }).map((_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  a: `A-${index}`,
  b: `B-${index}`,
  c: `C-${index}`,
  address: `London, Park Lane no. ${index}`,
}));
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" :scroll-x="1010" />
  </div>
</template>

<style scoped></style>
