<script setup lang="ts">
/** Demo: SnTreeSelect — size presets (trigger height + font size). */
import { ref } from 'vue';
import { SnTreeSelect } from '@snui/vue-web';
import type { SnTreeSelectSize } from '@snui/vue-web';

const value = ref<string | null>('guide');
const sizes: SnTreeSelectSize[] = ['mini', 'small', 'medium', 'large'];

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
  <div class="size-list">
    <div v-for="size in sizes" :key="size" class="size-row">
      <span class="size-label">{{ size }}</span>
      <SnTreeSelect
        v-model="value"
        :options="options"
        :size="size"
        placeholder="选择节点"
        style="width: 200px"
      />
    </div>
  </div>
</template>

<style scoped>
.size-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.size-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.size-label {
  flex: none;
  width: 52px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
