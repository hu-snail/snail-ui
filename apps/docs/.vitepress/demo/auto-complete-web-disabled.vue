<script setup lang="ts">
/** Demo: SnAutoComplete — disabled. */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const options = ['React', 'Vue', 'Svelte', 'Solid'];
</script>

<template>
  <div class="demo-row">
    <SnAutoComplete model-value="Vue" :options="options" disabled style="width: 200px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
