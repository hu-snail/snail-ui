<script setup lang="ts">
/** Demo: SnCheckboxGroup — options + slot paths. */
import { ref } from 'vue';
import { SnCheckbox, SnCheckboxGroup } from '@snui/vue-web';

const cities = ref<string[]>(['shanghai']);
</script>

<template>
  <div class="demo-col">
    <SnCheckboxGroup v-model="cities" :options="['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen']" />
    <SnCheckboxGroup v-model="cities">
      <SnCheckbox value="Beijing" label="Beijing (slot path)" />
      <SnCheckbox value="Shanghai" label="Shanghai (slot path)" />
    </SnCheckboxGroup>
    <pre class="demo-log">{{ cities }}</pre>
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
