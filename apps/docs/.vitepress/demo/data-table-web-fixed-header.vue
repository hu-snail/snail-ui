<script setup lang="ts">
/** Demo: SnDataTable — max-height scroll container with sticky header. */
import { SnDataTable } from '@snui/vue-web'

const columns = [
  { title: 'Name', key: 'name' },
  { title: 'Age', key: 'age' },
  { title: 'Address', key: 'address' },
]

const data = Array.from({ length: 20 }).map((_, index) => ({
  key: index,
  name: `Edward King ${index}`,
  age: 32,
  address: `London, Park Lane no. ${index}`,
}))
</script>

<template>
  <div class="sn-demo">
    <SnDataTable :columns="columns" :data="data" :max-height="220" />
  </div>
</template>

<style scoped>
</style>
