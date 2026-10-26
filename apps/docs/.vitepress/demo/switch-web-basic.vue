<script setup lang="ts">
/** Demo: SnSwitch — basic v-model. */
import { ref } from 'vue'
import { SnSwitch } from '@snui/vue-web'
const on = ref(false)
</script>

<template>
  <div class="demo-row">
    <SnSwitch v-model="on" />
    <span class="demo-log">{{ on }}</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
