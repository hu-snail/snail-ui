<script setup lang="ts">
/** Demo: SnSelect — loading. */
import { SnSelect } from '@snui/vue-web';
const cities = ['Beijing', 'Shanghai', 'Guangzhou'];
</script>

<template>
  <div class="demo-row">
    <SnSelect :options="cities" loading placeholder="Loading…" style="width: 200px" />
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
