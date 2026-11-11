<script setup lang="ts">
/** Demo: SnTreeSelect — disabled (component + disabled option nodes). */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
const value = ref<string | null>('guide');
const options = [
  {
    label: '文档',
    value: 'docs',
    disabled: true,
    children: [{ label: '指南', value: 'guide' }],
  },
  { label: '工具', value: 'tools' },
];
</script>

<template>
  <div class="demo-row">
    <SnTreeSelect v-model="value" :options="options" disabled style="width: 220px" />
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
