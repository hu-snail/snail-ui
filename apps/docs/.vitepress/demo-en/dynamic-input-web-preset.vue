<script setup lang="ts">
/** Demo: SnDynamicInput — preset / onCreate. */
import { ref } from 'vue'
import { SnDynamicInput } from '@snui/vue-web'
const items = ref<number[]>([1])

function preset(): number {
  return items.value.length + 1
}
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="items" :preset="preset" style="max-width: 300px;" />
    <span class="demo-log">New items auto-increment: {{ items }}</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
