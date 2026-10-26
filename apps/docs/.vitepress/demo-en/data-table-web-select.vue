<script setup lang="ts">
/** Demo: SnDataTable — row selection with checked-row-keys + disabled rows. */
import { ref } from 'vue';
import { SnDataTable } from '@snui/vue-web';

const checkedRowKeys = ref<Array<string | number>>([]);

const columns = [
  {
    type: 'selection',
    disabled: (row: Record<string, unknown>) => row.name === 'Edward King 3',
  },
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
];

const data = Array.from({ length: 8 }).map((_, index) => ({
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
  key: index,
}));
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">
      You selected {{ checkedRowKeys.length }} rows (Edward King 3 is not selectable).
    </p>
    <SnDataTable
      :columns="columns"
      :data="data"
      :pagination="{ pageSize: 5 }"
      v-model:checked-row-keys="checkedRowKeys"
    />
  </div>
</template>

<style scoped>
.sn-demo-tip {
  margin: 0 0 24px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}
</style>
