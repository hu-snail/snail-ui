<script setup lang="ts">
/** Demo: SnTree — keyField / labelField / childrenField remapping. */
import { ref } from 'vue'
import { SnTree } from '@snui/vue-web'
import type { SnTreeOption } from '@snui/vue-web'

const selected = ref<(string | number)[]>([])

const data: SnTreeOption[] = [
  {
    id: 1,
    title: 'East China region',
    offices: [
      { id: 11, title: 'Shanghai office' },
      { id: 12, title: 'Hangzhou office' },
    ],
  },
  { id: 2, title: 'South China region' },
]
</script>

<template>
  <div class="sn-demo">
    <SnTree
      v-model:selected-keys="selected"
      :data="data"
      key-field="id"
      label-field="title"
      children-field="offices"
      :default-expanded-keys="[1]"
    />
  </div>
</template>

<style scoped>
.sn-demo { max-width: 320px; }
</style>
