<script setup lang="ts">
/** Demo: SnRadioGroup button — RadioButton style. */
import { ref } from 'vue';
import { SnRadioGroup } from '@snui/vue-web';
const size = ref('medium');
</script>

<template>
  <div class="demo-col">
    <SnRadioGroup v-model="size" button :options="['mini', 'tiny', 'small', 'medium', 'large']" />
    <pre class="demo-log">{{ size }}</pre>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-log {
  margin: 0;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
}
</style>
