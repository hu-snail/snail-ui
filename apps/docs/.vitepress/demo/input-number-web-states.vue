<script setup lang="ts">
/** Demo: SnInputNumber — disabled / readonly / clearable. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const v = ref(10)
</script>

<template>
  <div class="demo-row">
    <SnInputNumber v-model="v" disabled />
    <SnInputNumber v-model="v" readonly />
    <SnInputNumber v-model="v" clearable />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
