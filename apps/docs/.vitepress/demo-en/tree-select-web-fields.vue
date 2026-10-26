<script setup lang="ts">
/** Demo: SnTreeSelect — custom fields. */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
const value = ref<string | null>(null);
const options = [
  {
    title: 'Department',
    key: 'dept',
    children: [
      { title: 'Frontend team', key: 'fe' },
      { title: 'Design team', key: 'design' },
    ],
  },
];
</script>

<template>
  <SnTreeSelect
    v-model="value"
    :options="options"
    label-field="title"
    key-field="key"
    placeholder="Custom field"
    style="width: 240px"
  />
</template>
