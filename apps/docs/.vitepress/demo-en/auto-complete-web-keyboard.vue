<script setup lang="ts">
/** Demo: SnAutoComplete — keyboard flow (ArrowUp/Down + Enter + Esc). */
import { ref } from 'vue'
import { SnAutoComplete } from '@snui/vue-web'
const value = ref('')
const options = ['React', 'Vue', 'Svelte', 'Solid']
</script>

<template>
  <div class="demo-col">
    <SnAutoComplete v-model="value" :options="options" placeholder="↑↓ to highlight, Enter to select, Esc to close" style="width: 300px;" />
    <span class="demo-log">Try: type v → ↑↓ → Enter</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
