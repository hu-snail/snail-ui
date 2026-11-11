<script setup lang="ts">
/** Demo: SnSegment — controlled value with external state readout. */
import { ref } from 'vue';
import { SnSegment } from '@snui/vue-web';

const plan = ref('monthly');
const plans = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

function reset(): void {
  plan.value = 'monthly';
}
</script>

<template>
  <div class="demo-col">
    <SnSegment v-model="plan" :options="plans" />
    <div class="demo-row">
      <p class="demo-note">Selected: <b>{{ plan }}</b></p>
      <button type="button" class="demo-reset" @click="reset">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.demo-note {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.demo-reset {
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  padding: 2px 10px;
  cursor: pointer;
}
</style>
