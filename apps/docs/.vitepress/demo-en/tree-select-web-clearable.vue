<script setup lang="ts">
/** Demo: SnTreeSelect — clearable. */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
const value = ref<string | null>('guide');
const options = [
  {
    label: 'Docs',
    value: 'docs',
    children: [{ label: 'Guide', value: 'guide' }],
  },
  { label: 'Tools', value: 'tools' },
];
</script>

<template>
  <div class="demo-row">
    <SnTreeSelect v-model="value" :options="options" clearable style="width: 220px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
