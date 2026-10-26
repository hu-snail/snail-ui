<script setup lang="ts">
/**
 * steps-web-clickable — SnSteps with `v-model:current`. Steps activate on
 * click (the disabled step does not), and the derived statuses update.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
const log = ref<number[]>([]);
</script>

<template>
  <div class="steps-demo">
    <SnSteps v-model:current="current" @update:current="(v: number) => log.push(v)">
      <SnStep title="Step 1" description="Clickable" />
      <SnStep title="Step 2" description="Clickable" />
      <SnStep title="Step 3" description="Completed step" />
      <SnStep title="Step 4" description="Disabled, not clickable" disabled />
    </SnSteps>
    <p class="steps-demo__state">
      current：<code>{{ current }}</code>
      <span class="steps-demo__log">Click log: {{ log.join(' → ') || '(no clicks)' }}</span>
    </p>
  </div>
</template>

<style scoped>
.steps-demo {
  width: 100%;
}
.steps-demo__state {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin: 20px 0 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.steps-demo__state code {
  background: var(--sn-web-color-background-subtle);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.steps-demo__log {
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
</style>
