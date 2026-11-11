<script setup lang="ts">
/** Demo: SnCheckbox — disabled (checked / unchecked). */
import { ref } from 'vue';
import { SnCheckbox } from '@snui/vue-web';
const v = ref(true);
</script>

<template>
  <div class="demo-row">
    <SnCheckbox v-model="v" disabled label="Disabled (checked)" />
    <SnCheckbox :model-value="false" disabled label="Disabled (unchecked)" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
