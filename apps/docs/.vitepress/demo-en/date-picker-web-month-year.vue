<script setup lang="ts">
/** Demo: SnDatePicker — month / year modes. */
import { ref } from 'vue'
import { SnDatePicker } from '@snui/vue-web'
const month = ref<number | null>(null)
const year = ref<number | null>(null)
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="month" type="month" placeholder="Select month" />
    <SnDatePicker v-model="year" type="year" placeholder="Select year" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 12px; align-items: center; }
</style>
