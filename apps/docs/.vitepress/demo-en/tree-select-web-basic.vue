<script setup lang="ts">
/** Demo: SnTreeSelect — basic. */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
const value = ref<string | null>(null);
const options = [
  {
    label: 'Docs',
    value: 'docs',
    children: [
      { label: 'Guide', value: 'guide' },
      { label: 'Components', value: 'components' },
    ],
  },
  {
    label: 'Tools',
    value: 'tools',
    children: [{ label: 'CLI', value: 'cli' }],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnTreeSelect
      v-model="value"
      :options="options"
      placeholder="Select node"
      style="width: 240px"
    />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
