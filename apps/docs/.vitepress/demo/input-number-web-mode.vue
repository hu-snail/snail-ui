<script setup lang="ts">
/** Demo: SnInputNumber — button mode: symbol (− +) vs spinner (↑ ↓). */
import { ref } from 'vue';
import { SnInputNumber } from '@snui/vue-web';
const v = ref(2);
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" button-mode="symbol" class="demo-field" />
    <SnInputNumber v-model="v" button-mode="spinner" class="demo-field" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.demo-field {
  width: 140px;
}
</style>
