<script setup lang="ts">
/** Demo: SnTreeSelect — multiple. */
import { ref } from 'vue'
import { SnTreeSelect } from '@snui/vue-web'
const value = ref<string[]>(['guide'])
const options = [
  {
    label: 'Docs',
    value: 'docs',
    children: [
      { label: 'Guide', value: 'guide' },
      { label: 'Components', value: 'components' },
      { label: 'Theme', value: 'theme' },
    ],
  },
  { label: 'Tools', value: 'tools' },
]
</script>

<template>
  <div class="demo-col">
    <SnTreeSelect v-model="value" :options="options" multiple default-expand-all placeholder="Multiple" style="width: 300px;" />
    <pre class="demo-log">{{ value }}</pre>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { margin: 0; padding: 8px 12px; background: var(--vp-c-bg-soft); border-radius: 6px; font-size: 12px; }
</style>
