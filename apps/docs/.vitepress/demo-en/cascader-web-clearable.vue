<script setup lang="ts">
/** Demo: SnCascader — clearable. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>(['zj', 'hz']);
const options = [
  {
    label: 'Zhejiang',
    value: 'zj',
    children: [{ label: 'Hangzhou', value: 'hz' }],
  },
  {
    label: 'Guangdong',
    value: 'gd',
    children: [{ label: 'Shenzhen', value: 'sz' }],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnCascader v-model="value" :options="options" clearable style="width: 220px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
