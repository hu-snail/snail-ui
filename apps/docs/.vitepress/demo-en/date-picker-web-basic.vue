<script setup lang="ts">
/** Demo: SnDatePicker — basic date. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const value = ref<number | null>(Date.now())
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="value" />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
