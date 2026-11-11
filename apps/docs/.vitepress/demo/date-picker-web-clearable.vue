<script setup lang="ts">
/** Demo: SnDatePicker — clearable. */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const value = ref<number | null>(Date.now());
</script>

<template>
  <div class="demo-row">
    <SnDatePicker v-model="value" clearable />
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
