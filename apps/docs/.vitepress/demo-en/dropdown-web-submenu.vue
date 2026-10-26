<script setup lang="ts">
/** Demo: SnDropdown — submenu. */
import { SnButton, SnDropdown } from '@snui/vue-web';
const options = [
  { label: 'File', key: 'file' },
  {
    label: 'Export as',
    key: 'export',
    children: [
      { label: 'PDF', key: 'pdf' },
      { label: 'PNG', key: 'png' },
      { label: 'Markdown', key: 'md' },
    ],
  },
  { label: 'Close', key: 'close' },
];
</script>

<template>
  <SnDropdown trigger="click" :options="options">
    <SnButton>With submenu ▸</SnButton>
  </SnDropdown>
</template>
