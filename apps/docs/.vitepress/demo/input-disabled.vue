<script setup lang="ts">
/** Demo: SnInput — disabled state. */
import { SnInput } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <SnInput model-value="Disabled field" disabled />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
</style>
