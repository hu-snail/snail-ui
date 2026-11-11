<script setup lang="ts">
/** Demo: SnSegment — disabled root + disabled single item. */
import { SnSegment } from '@snui/vue-web';

const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
  { value: 'settings', label: 'Settings' },
];
const mixed = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics', disabled: true },
  { value: 'reports', label: 'Reports' },
];
</script>

<template>
  <div class="demo-col">
    <SnSegment disabled :options="views" :model-value="'dashboard'" />
    <SnSegment :options="mixed" :model-value="'dashboard'" />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
