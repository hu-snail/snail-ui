<script setup lang="ts">
/** Demo: SnDataTable — single (radio-like) selection via multiple: false. */
import { ref } from 'vue'
import { SnDataTable } from '@snui/vue-web'

const checkedRowKeys = ref<Array<string | number>>([])

const columns = [
  { type: 'selection', multiple: false },
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
  { key: 2, name: 'Joe Black', age: 32 },
]
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo-tip">Single select: {{ checkedRowKeys.length === 0 ? 'None selected' : `Row ${String(checkedRowKeys[0] + 1)}` }}</p>
    <SnDataTable :columns="columns" :data="data" v-model:checked-row-keys="checkedRowKeys" />
  </div>
</template>

<style scoped>
.sn-demo-tip { margin: 0 0 24px; color: var(--sn-web-color-text-secondary); font-size: 14px; }
</style>
