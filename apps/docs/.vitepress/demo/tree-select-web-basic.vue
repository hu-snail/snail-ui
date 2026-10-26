<script setup lang="ts">
/** Demo: SnTreeSelect — basic. */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
const value = ref<string | null>(null);
const options = [
  {
    label: '文档',
    value: 'docs',
    children: [
      { label: '指南', value: 'guide' },
      { label: '组件', value: 'components' },
    ],
  },
  {
    label: '工具',
    value: 'tools',
    children: [{ label: 'CLI', value: 'cli' }],
  },
];
</script>

<template>
  <div class="demo-row">
    <SnTreeSelect v-model="value" :options="options" placeholder="选择节点" style="width: 240px" />
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
