<script setup lang="ts">
/** Demo: SnInput — radius presets. */
import { SnInput } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <h4 class="sn-demo__title">Radius presets</h4>
    <SnInput model-value="default radius" radius="default" readonly />
    <SnInput model-value="pill radius (search bar)" radius="pill" readonly />
    <SnInput model-value="square radius" radius="square" readonly />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
.sn-demo__title {
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
</style>
