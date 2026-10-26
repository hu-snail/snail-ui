<script setup lang="ts">
/** Demo: SnCascader — custom fields. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>([]);
const options = [
  {
    name: 'Frontend',
    id: 'fe',
    subs: [
      { name: 'Vue', id: 'vue' },
      { name: 'React', id: 'react' },
    ],
  },
  {
    name: 'Backend',
    id: 'be',
    subs: [{ name: 'Node', id: 'node' }],
  },
];
</script>

<template>
  <SnCascader
    v-model="value"
    :options="options"
    label-field="name"
    value-field="id"
    children-field="subs"
    placeholder="Custom field"
    style="width: 240px"
  />
</template>
