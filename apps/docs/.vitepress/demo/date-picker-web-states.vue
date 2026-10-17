<script setup lang="ts">
/** Demo: SnDatePicker — clearable / disabled / readonly. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const value = ref<number | null>(Date.now())
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="value" clearable />
    <SnDatePicker v-model="value" disabled />
    <SnDatePicker v-model="value" readonly />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
