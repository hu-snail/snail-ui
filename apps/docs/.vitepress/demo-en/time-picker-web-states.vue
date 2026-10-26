<script setup lang="ts">
/** Demo: SnTimePicker — clearable / disabled / readonly. */
import { ref } from 'vue';
import { SnTimePicker } from '@snui/vue-web';
const value = ref<number | null>(new Date().setHours(8, 0, 0, 0));
</script>

<template>
  <div class="demo-row">
    <SnTimePicker v-model="value" clearable />
    <SnTimePicker v-model="value" disabled />
    <SnTimePicker v-model="value" readonly />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
