<script setup lang="ts">
/** Demo: SnColorPicker — alpha. */
import { ref } from 'vue'
import { SnColorPicker } from '@snui/vue-web'
const color = ref('#ff880080')
</script>

<template>
  <div class="demo-row">
    <SnColorPicker v-model="color" show-alpha />
    <span class="demo-log">{{ color }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-family: monospace; font-size: 13px; color: var(--vp-c-text-2); }
</style>
