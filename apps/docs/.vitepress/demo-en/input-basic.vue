<script setup lang="ts">
/** Demo: SnInput — basic v-model binding. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'

const value = ref('hello')
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="value" placeholder="Type something…" />
    <p class="sn-demo__meta">v-model = <code>{{ value }}</code></p>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
.sn-demo__meta { margin: 0; font-size: 12px; color: var(--vp-c-text-2); }
</style>