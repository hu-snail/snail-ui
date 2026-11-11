<script setup lang="ts">
/** Demo: SnSegment — separators between adjacent unselected items. */
import { SnSegment } from '@snui/vue-web';

const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
  { value: 'settings', label: 'Settings' },
];
</script>

<template>
  <SnSegment separators :options="views" :model-value="'dashboard'" />
</template>
