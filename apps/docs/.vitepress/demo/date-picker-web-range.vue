<script setup lang="ts">
/** Demo: SnDatePicker — range modes. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const range = ref<[number, number] | null>(null)
const datetimeRange = ref<[number, number] | null>(null)
</script>

<template>
  <div class="demo-col">
    <SnDatePicker v-model="range" type="daterange" />
    <SnDatePicker v-model="datetimeRange" type="datetimerange" />
    <pre class="demo-log">range: {{ range?.[0] }} ~ {{ range?.[1] }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
