<script setup lang="ts">
/** Demo: SnTag — loading state (AUI additive). */
import { SnTag } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag loading>Loading</SnTag>
      <SnTag loading type="primary">Saving</SnTag>
      <SnTag loading closable>Cannot close while loading</SnTag>
      <SnTag loading round type="success">Submitting</SnTag>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
