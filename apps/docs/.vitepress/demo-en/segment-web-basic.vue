<script setup lang="ts">
/** Demo: SnSegment — basic labels + v-model. */
import { ref } from 'vue';
import { SnSegment } from '@snui/vue-web';

const view = ref('dashboard');
const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
  { value: 'settings', label: 'Settings' },
];
</script>

<template>
  <div class="demo-col">
    <SnSegment v-model="view" :options="views" />
    <p class="demo-note">Selected: <b>{{ view }}</b></p>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}
.demo-note {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
