<script setup lang="ts">
/** Demo: SnDataTable — remote-style sorter (sorter=true shows the icon only). */
import { ref } from 'vue';
import { SnDataTable } from '@snui/vue-web';
const lastSort = ref('');

const columns = [
  { title: 'Name', key: 'name', sorter: true },
  { title: 'Age', key: 'age', sorter: true },
];

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
  { key: 2, name: 'Joe Black', age: 32 },
];

interface SortStateLike {
  columnKey: string | number;
  order: 'ascend' | 'descend' | false;
}

function handleSorter(state: SortStateLike | SortStateLike[] | null): void {
  const single = Array.isArray(state) ? state[0] : state;
  if (!single || single.order === false) {
    lastSort.value = 'Sorting cancelled';
    return;
  }
  // sorter=true 只负责展示图标，数据排序由远端完成（本 demo 仅记录状态）。
  lastSort.value = `column=${String(single.columnKey)} order=${single.order}`;
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">Remote sort state:{{ lastSort || '—' }}</p>
    <SnDataTable :columns="columns" :data="data" @update:sorter="handleSorter" />
  </div>
</template>

<style scoped>
.sn-demo-tip {
  margin: 0 0 24px;
  color: var(--sn-web-color-text-secondary);
  font-size: 14px;
}
</style>
