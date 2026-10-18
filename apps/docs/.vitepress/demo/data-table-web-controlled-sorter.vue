<script setup lang="ts">
/** Demo: SnDataTable — controlled sortOrder via column.sortOrder. */
import { ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'
const sortOrder = ref<'ascend' | 'descend' | false>('ascend')

const columns = [
  {
    title: 'Name',
    key: 'name',
    sorter: 'default',
    sortOrder,
  },
  { title: 'Age', key: 'age' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
  { key: 2, name: 'Joe Black', age: 32 },
]

interface SortStateLike {
  columnKey: string | number
  order: 'ascend' | 'descend' | false
}

function handleSorter(state: SortStateLike | SortStateLike[] | null): void {
  const single = Array.isArray(state) ? state[0] : state
  sortOrder.value = single?.order ?? false
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">受控排序：{{ sortOrder === false ? '未排序' : sortOrder }}</p>
    <SnDataTable :columns="columns" :data="data" @update:sorter="handleSorter" />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 560px; }
.sn-demo-tip { margin: 0 0 24px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
</style>
