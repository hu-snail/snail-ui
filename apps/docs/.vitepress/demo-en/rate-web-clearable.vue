<script setup lang="ts">
/** Demo: SnRate — clearable. */
import { ref } from 'vue';
import { SnRate } from '@snui/vue-web';
const value = ref(3);
</script>

<template>
  <div class="demo-row">
    <SnRate v-model="value" clearable />
    <span class="demo-log">Click the current score to clear it: {{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
