<script setup lang="ts">
/** Demo: SnSwitch — loading. */
import { SnSwitch } from '@snui/vue-web';
</script>

<template>
  <div class="demo-row">
    <SnSwitch :model-value="false" loading />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
