<script setup lang="ts">
/** Demo: SnCascader — clearable / disabled. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>(['zj', 'hz']);
const options = [
  {
    label: 'Zhejiang',
    value: 'zj',
    disabled: true,
    children: [{ label: 'Hangzhou', value: 'hz' }],
  },
  {
    label: 'Guangdong',
    value: 'gd',
    children: [{ label: 'Shenzhen', value: 'sz', disabled: true }],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnCascader v-model="value" :options="options" clearable style="width: 220px" />
    <SnCascader v-model="value" :options="options" disabled style="width: 220px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
