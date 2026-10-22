<script setup lang="ts">
/**
 * steps-web-status — shows all four statuses: one group driven by the
 * parent `status="error"`, one group where a single step overrides its
 * own status explicitly.
 */
import { SnSteps, SnStep } from '@snui/vue-web'
</script>

<template>
  <div class="steps-demo">
    <section class="steps-demo__block">
      <p class="steps-demo__label">:current="2" status="error"</p>
      <SnSteps :current="2" status="error">
        <SnStep title="Submitted" description="finish" />
        <SnStep title="Review failed" description="error" />
        <SnStep title="Resubmit" description="wait" />
      </SnSteps>
    </section>

    <section class="steps-demo__block">
      <p class="steps-demo__label">Per-step status override (step 2 set to error)</p>
      <SnSteps :current="1">
        <SnStep title="In progress" description="process" />
        <SnStep title="Error" description="explicit error" status="error" />
        <SnStep title="To do" description="wait" />
      </SnSteps>
    </section>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
.steps-demo__block + .steps-demo__block {
  margin-top: 28px;
}
.steps-demo__label {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
  font-family: ui-monospace, monospace;
}
</style>
