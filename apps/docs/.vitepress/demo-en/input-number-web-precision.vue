<script setup lang="ts">
/** Demo: SnInputNumber — precision. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const price = ref(12.3456)
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="price" :precision="2" :step="0.01" class="demo-field" />
    <span class="demo-log">{{ price }} (2 decimals kept)</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-field { width: 160px; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
