<script setup lang="ts">
/** Demo: SnDatePicker — disabled. */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const value = ref<number | null>(Date.now());
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="value" disabled />
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
