<script setup lang="ts">
/** Demo: SnDataTable — render fn column title. */
import { h } from 'vue'
import { SnDataTable } from '@snui/vue-web'

const columns = [
  {
    title: () => h('span', { style: { color: 'var(--sn-web-color-action-primary)' } }, 'Name (rendered header)'),
    key: 'name',
  },
  { title: 'Age', key: 'age' },
]

const data = [
  { key: 0, name: 'John Brown', age: 32 },
  { key: 1, name: 'Jim Green', age: 42 },
]
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" />
  </div>
</template>

<style scoped>
</style>
