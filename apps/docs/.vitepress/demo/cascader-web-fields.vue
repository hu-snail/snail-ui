<script setup lang="ts">
/** Demo: SnCascader — custom fields. */
import { ref } from 'vue';
import { SnCascader } from '@snui/vue-web';
const value = ref<(string | number)[]>([]);
const options = [
  {
    name: '前端',
    id: 'fe',
    subs: [
      { name: 'Vue', id: 'vue' },
      { name: 'React', id: 'react' },
    ],
  },
  {
    name: '后端',
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
    placeholder="自定义字段"
    style="width: 240px"
  />
</template>
