<script setup lang="ts">
/**
 * steps-web-content-placement — title/description below the indicator.
 *
 * Shows: `contentPlacement="bottom"` on an otherwise identical horizontal
 * steps, so the layout delta is the only variable.
 */
import { ref } from 'vue'
import { SnSteps, SnStep } from '@snui/vue-web'

const current = ref(1)
</script>

<template>
  <div class="steps-cp">
    <div class="steps-cp__row">
      <span class="steps-cp__cap">contentPlacement="right" (default)</span>
      <SnSteps v-model:current="current" content-placement="right">
        <SnStep title="Prepare documents" description="ID and original contract" />
        <SnStep title="Offline signing" description="Arrive at the scheduled time" />
        <SnStep title="Wait for the loan disbursement" description="Usually 1–3 business days" />
      </SnSteps>
    </div>

    <div class="steps-cp__row">
      <span class="steps-cp__cap">contentPlacement="bottom"</span>
      <SnSteps v-model:current="current" content-placement="bottom">
        <SnStep title="Prepare documents" description="ID and original contract" />
        <SnStep title="Offline signing" description="Arrive at the scheduled time" />
        <SnStep title="Wait for the loan disbursement" description="Usually 1–3 business days" />
      </SnSteps>
    </div>

    <p class="steps-cp__hint">
      <code>contentPlacement</code> Only applies in horizontal mode; vertical is always right.
    </p>
  </div>
</template>

<style scoped>
.steps-cp {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.steps-cp__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-cp__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-cp__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
