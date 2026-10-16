<script setup lang="ts">
/** Demo: SnInputNumber — buttonPlacement + sizes. */
import { ref } from 'vue'
import { SnInputNumber } from '@snui/vue-web'
const v = ref(1)
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnInputNumber v-for="s in ['mini', 'tiny', 'small', 'medium', 'large']" :key="s" v-model="v" :size="s" />
    </div>
    <SnInputNumber v-model="v" button-placement="right" />
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.demo-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
</style>
