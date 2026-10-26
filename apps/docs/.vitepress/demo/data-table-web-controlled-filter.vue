<script setup lang="ts">
/** Demo: SnDataTable — controlled filterOptionValues + update:filters. */
import { ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'

interface FilterStateLike {
  [key: string]:
    | ReadonlyArray<string | number>
    | string
    | number
    | null
    | undefined
}

interface ColumnLike {
  key: string | number
}

const filterValues = ref<Array<string | number> | null>(['London'])

const columns = [
  { title: 'Name', key: 'name' },
  {
    title: 'Address',
    key: 'address',
    filter: 'default',
    filterOptionValues: filterValues,
    filterOptions: [
      { label: 'London', value: 'London' },
      { label: 'New York', value: 'New York' },
    ],
  },
]

const data = [
  { key: 0, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: 1, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: 2, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park' },
  { key: 3, name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]

function handleFilters(filters: FilterStateLike, column: ColumnLike): void {
  const next = filters[String(column.key)]
  filterValues.value = Array.isArray(next) ? [...next] : null
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">
      受控过滤值：{{ filterValues === null ? '无' : filterValues.join(', ') || '空' }}
    </p>
    <SnDataTable :columns="columns" :data="data" @update:filters="handleFilters" />
  </div>
</template>

<style scoped>
.sn-demo-tip { margin: 0 0 24px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
</style>
