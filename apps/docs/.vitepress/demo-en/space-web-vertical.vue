<script setup lang="ts">
/** Demo: SnSpace — vertical & tuple gap. */
import { SnButton, SnSpace } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnSpace vertical>
      <SnButton>Vertical 1</SnButton>
      <SnButton>Vertical 2</SnButton>
      <SnButton>Vertical 3</SnButton>
    </SnSpace>
    <SnSpace :size="[32, 8]" wrap style="max-width: 240px">
      <SnButton v-for="i in 6" :key="i">Button {{ i }}</SnButton>
    </SnSpace>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
