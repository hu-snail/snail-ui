<script setup lang="ts">
/** Demo: SnColorPicker — basic. */
import { ref } from 'vue'
import { SnColorPicker } from '@snui/vue-web'
const color = ref('#18a058')
</script>

<template>
  <div class="demo-row">
    <SnColorPicker v-model="color" />
    <span class="demo-log">{{ color }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-family: monospace; font-size: 13px; color: var(--vp-c-text-2); }
</style>
