<script setup lang="ts">
/** Demo: SnTimePicker — format HH:mm. */
import { ref } from 'vue'
import { SnTimePicker } from '@snui/vue-web'
const value = ref<number | null>(new Date().setHours(14, 0, 0, 0))
</script>

<template>
  <div class="demo-row">
    <SnTimePicker v-model="value" format="HH:mm" />
    <SnTimePicker v-model="value" format="HH:mm:ss" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
