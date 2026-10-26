<script setup lang="ts">
/** Demo: SnCheckbox — disabled / readonly. */
import { ref } from 'vue'
import { SnCheckbox } from '@snui/vue-web'
const v = ref(true)
</script>

<template>
  <div class="demo-row">
    <SnCheckbox v-model="v" disabled label="Disabled (checked)" />
    <SnCheckbox :model-value="false" disabled label="Disabled (unchecked)" />
    <SnCheckbox v-model="v" readonly label="Readonly" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; flex-wrap: wrap; }
</style>
