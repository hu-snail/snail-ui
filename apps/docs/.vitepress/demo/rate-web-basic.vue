<script setup lang="ts">
/** Demo: SnRate — basic. */
import { ref } from 'vue'
import { SnRate } from '@snui/vue-web'
const value = ref(3)
</script>

<template>
  <div class="demo-row">
    <SnRate v-model="value" />
    <span class="demo-log">{{ value }} 星</span>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
