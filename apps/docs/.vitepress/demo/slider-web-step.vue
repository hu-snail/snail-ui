<script setup lang="ts">
/** Demo: SnSlider — step snapping + showSteps ticks. */
import { ref } from 'vue';
import { SnSlider, SnInputNumber, SnSwitch } from '@snui/vue-web';
const v = ref(20);
const step = ref<number | null>(5);
const showSteps = ref(true);
</script>

<template>
  <div class="demo-col">
    <div class="demo-controls">
      <span class="demo-label">Step</span>
      <SnInputNumber
        v-model="step"
        :min="1"
        :max="25"
        :step="1"
        size="small"
        class="demo-step"
      />
      <span class="demo-label">Show steps</span>
      <SnSwitch v-model="showSteps" size="small" />
    </div>
    <SnSlider v-model="v" :min="0" :max="100" :step="step ?? 1" :show-steps="showSteps" />
    <span class="demo-log">v = {{ v }} · step = {{ step }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}
.demo-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
.demo-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.demo-step {
  width: 96px;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
