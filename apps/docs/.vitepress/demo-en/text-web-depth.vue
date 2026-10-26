<script setup lang="ts">
/** Demo: SnText — depth scale. */
import { SnText } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnText depth="1">depth 1 secondary text</SnText>
    <SnText depth="2">depth 2 lighter</SnText>
    <SnText depth="3">depth 3 lightest</SnText>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}
</style>
