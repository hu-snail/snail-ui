<script setup lang="ts">
/**
 * Demo: SnButton (Web) — disabled & loading states (every semantic hue).
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { ref } from 'vue';
import { SnButton } from '@snui/vue-web';

const loading = ref(false);
function trigger(): void {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <div class="sn-demo sn-demo--stack">
    <p class="sn-demo__label">Disabled</p>
    <div class="sn-demo__row">
      <SnButton disabled>Default button</SnButton>
      <SnButton disabled type="primary">Primary button</SnButton>
      <SnButton disabled type="success">Success button</SnButton>
      <SnButton disabled type="info">Info button</SnButton>
      <SnButton disabled type="warning">Warning button</SnButton>
      <SnButton disabled type="error">Danger button</SnButton>
    </div>

    <p class="sn-demo__label">Loading</p>
    <div class="sn-demo__row">
      <SnButton loading type="primary">Saving</SnButton>
      <SnButton loading type="success">Submitting</SnButton>
      <SnButton loading type="error">Deleting</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger">Click to trigger loading</SnButton>
    </div>
  </div>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
