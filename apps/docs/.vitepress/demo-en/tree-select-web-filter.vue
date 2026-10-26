<script setup lang="ts">
/** Demo: SnTreeSelect — filterable + expand all. */
import { ref } from 'vue'
import { SnTreeSelect } from '@snui/vue-web'
const value = ref<string | null>(null)
const options = [
  {
    label: 'Components',
    value: 'components',
    children: [
      { label: 'Button', value: 'button' },
      { label: 'Select', value: 'select' },
      { label: 'TreeSelect', value: 'tree-select' },
    ],
  },
  { label: 'Guide', value: 'guide' },
]
</script>

<template>
  <SnTreeSelect v-model="value" :options="options" filterable placeholder="Type to filter (e.g. tree)" style="width: 260px;" />
</template>
