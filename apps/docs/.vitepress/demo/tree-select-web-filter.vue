<script setup lang="ts">
/** Demo: SnTreeSelect — filterable + expand all. */
import { ref } from 'vue'
import { SnTreeSelect } from '@snui/vue-web'
const value = ref<string | null>(null)
const options = [
  {
    label: '组件',
    value: 'components',
    children: [
      { label: 'Button 按钮', value: 'button' },
      { label: 'Select 选择器', value: 'select' },
      { label: 'TreeSelect 树选择', value: 'tree-select' },
    ],
  },
  { label: '指南', value: 'guide' },
]
</script>

<template>
  <SnTreeSelect v-model="value" :options="options" filterable placeholder="输入过滤（如 tree）" style="width: 260px;" />
</template>
