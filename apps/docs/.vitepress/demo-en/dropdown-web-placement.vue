<script setup lang="ts">
/** Demo: SnDropdown — placements. */
import { SnButton, SnDropdown } from '@snui/vue-web'
const options = [
  { label: 'Option 1', key: 'a' },
  { label: 'Option 2', key: 'b' },
]
</script>

<template>
  <div class="demo-row">
    <SnDropdown trigger="click" :options="options" placement="bottom-start"><SnButton size="small">bottom-start</SnButton></SnDropdown>
    <SnDropdown trigger="click" :options="options" placement="bottom"><SnButton size="small">bottom</SnButton></SnDropdown>
    <SnDropdown trigger="click" :options="options" placement="bottom-end"><SnButton size="small">bottom-end</SnButton></SnDropdown>
    <SnDropdown trigger="click" :options="options" placement="top"><SnButton size="small">top (flipped)</SnButton></SnDropdown>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
