<script setup lang="ts">
/** Demo: SnDropdown — submenu. */
import { SnButton, SnDropdown } from '@snui/vue-web';
const options = [
  { label: '文件', key: 'file' },
  {
    label: '导出为',
    key: 'export',
    children: [
      { label: 'PDF', key: 'pdf' },
      { label: 'PNG', key: 'png' },
      { label: 'Markdown', key: 'md' },
    ],
  },
  { label: '关闭', key: 'close' },
];
</script>

<template>
  <SnDropdown trigger="click" :options="options">
    <SnButton>含子菜单 ▸</SnButton>
  </SnDropdown>
</template>
