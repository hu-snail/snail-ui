<script setup lang="ts">
/** Demo: SnDataTable — controlled page + size picker (update:page / update:page-size). */
import { reactive } from 'vue';
import { SnDataTable } from '@snui/vue-web';
const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
];

const data = Array.from({ length: 12 }).map((_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}));

const pagination = reactive({
  page: 2,
  pageSize: 5,
  showSizePicker: true,
  pageSizes: [3, 5, 7],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>

<style scoped></style>
