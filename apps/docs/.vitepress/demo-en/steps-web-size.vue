<script setup lang="ts">
/**
 * steps-web-size — the two size tiers side by side.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-size">
    <div class="steps-size__row">
      <span class="steps-size__cap">size="medium" (default)</span>
      <SnSteps v-model:current="current" size="medium">
        <SnStep title="Choose products" description="Pick from the catalog" />
        <SnStep title="Enter address" description="Shipping details" />
        <SnStep title="Confirm payment" description="Place order" />
      </SnSteps>
    </div>

    <div class="steps-size__row">
      <span class="steps-size__cap">size="small"</span>
      <SnSteps v-model:current="current" size="small">
        <SnStep title="Choose products" description="Pick from the catalog" />
        <SnStep title="Enter address" description="Shipping details" />
        <SnStep title="Confirm payment" description="Place order" />
      </SnSteps>
    </div>

    <p class="steps-size__hint">
      <code>size</code> also affects indicator diameter, title size, and node spacing.
    </p>
  </div>
</template>

<style scoped>
.steps-size {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}
.steps-size__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-size__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-size__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
