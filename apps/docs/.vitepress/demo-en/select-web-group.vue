<script setup lang="ts">
/** Demo: SnSelect — grouped options via children. */
import { ref } from 'vue';
import { SnSelect } from '@snui/vue-web';
const value = ref<string | null>(null);
const options = [
  {
    label: 'South China',
    children: [
      { label: 'Guangzhou', value: 'gz' },
      { label: 'Shenzhen', value: 'sz' },
    ],
  },
  {
    label: 'East China',
    children: [
      { label: 'Shanghai', value: 'sh' },
      { label: 'Hangzhou', value: 'hz' },
    ],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnSelect
      v-model="value"
      :options="options"
      placeholder="Select by region"
      style="width: 240px"
    />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
