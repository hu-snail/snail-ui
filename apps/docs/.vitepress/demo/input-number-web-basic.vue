<script setup lang="ts">
/** Demo: SnInputNumber — basic. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const value = ref<number | null>(5)
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="value" />
    <span class="demo-log">value = {{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
