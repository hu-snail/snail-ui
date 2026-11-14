<script setup lang="ts">
/** Demo: SnSegment — ghost variant: transparent shell + accent indicator. */
import { SnSegment } from '@snui/vue-web';

const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
  { value: 'settings', label: 'Settings' },
];
</script>

<template>
  <div class="demo-col">
    <SnSegment variant="ghost" :options="views" :model-value="'analytics'" />
    <SnSegment :options="views" :model-value="'analytics'" />
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
