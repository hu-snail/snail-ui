<script setup lang="ts">
/** Demo: SnDataTable — rowProps / rowClassName per row. */
import { ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'
const clicked = ref('')

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
  { key: 2, name: 'Joe Black', age: 32 },
]

function handleRowClick(row: Record<string, unknown>): void {
  clicked.value = String(row.name)
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">点击行（rowProps）：{{ clicked || '—' }}</p>
    <SnDataTable
      :columns="columns"
      :data="data"
      :row-props="(row) => ({ onClick: () => handleRowClick(row) })"
      :row-class-name="(row) => (Number(row.age) >= 40 ? 'sn-demo-senior' : '')"
    />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 560px; }
.sn-demo-tip { margin: 0 0 24px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
.sn-demo :deep(.sn-demo-senior .sn-data-table__td:first-child) { color: var(--sn-web-color-feedback-warning); }
</style>
