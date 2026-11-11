<script setup lang="ts">
/** Demo: SnAutoComplete — clearable. */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const b = ref('React');
const options = ['React', 'Vue', 'Svelte', 'Solid'];
</script>

<template>
  <div class="demo-row">
    <SnAutoComplete v-model="b" :options="options" clearable style="width: 200px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
