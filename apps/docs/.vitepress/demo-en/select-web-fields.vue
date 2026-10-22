<script setup lang="ts">
/** Demo: SnSelect — labelField / valueField. */
import { ref } from 'vue'
import { SnSelect } from '@snui/vue-web'
const value = ref<number | null>(null)
const options = [
  { name: 'Apple', id: 1 },
  { name: 'Banana', id: 2 },
  { name: 'Cherry', id: 3 },
]
</script>

<template>
  <div class="demo-row">
    <SnSelect v-model="value" :options="options" label-field="name" value-field="id" placeholder="Custom field" style="width: 240px;" />
    <span class="demo-log">id = {{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
