<script setup lang="ts">
/** Demo: SnCascader — filterable. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>([]);
const options = [
  {
    label: 'Zhejiang',
    value: 'zj',
    children: [
      { label: 'Hangzhou', value: 'hz', children: [{ label: 'Xihu District', value: 'xh' }] },
      { label: 'Ningbo', value: 'nb' },
    ],
  },
  {
    label: 'Guangdong',
    value: 'gd',
    children: [
      { label: 'Shenzhen', value: 'sz', children: [{ label: 'Nanshan District', value: 'ns' }] },
    ],
  },
];
</script>

<template>
  <SnCascader
    v-model="value"
    :options="options"
    filterable
    placeholder="Type to filter by path (e.g. Xihu)"
    style="width: 280px"
  />
</template>
