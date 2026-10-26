<script setup lang="ts">
/** Demo: SnCascader — expand trigger click / hover. */
import { ref } from 'vue'
import { SnCascader } from '@snui/vue-web'
const value = ref<(string | number)[]>([])
const options = [
  { label: 'Level 1 A', value: 'a', children: [{ label: 'Level 2 A1', value: 'a1' }, { label: 'Level 2 A2', value: 'a2' }] },
  { label: 'Level 1 B', value: 'b', children: [{ label: 'Level 2 B1', value: 'b1' }] },
]
</script>

<template>
  <div class="demo-row">
    <SnCascader v-model="value" :options="options" expand-trigger="hover" placeholder="Hover to expand" style="width: 220px;" />
    <SnCascader v-model="value" :options="options" placeholder="Click to expand (default)" style="width: 220px;" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
