<script setup lang="ts">
/** Demo: SnInputNumber — format / parse. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const amount = ref(1200)

function format(value: number): string {
  return `¥ ${value.toLocaleString('zh-CN')}`
}
function parse(text: string): number | null {
  const n = Number(text.replace(/[¥,\s]/g, ''))
  return Number.isNaN(n) ? null : n
}
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="amount" :format="format" :parse="parse" :step="100" />
    <span class="demo-log">amount = {{ amount }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
