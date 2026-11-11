<script setup lang="ts">
/** Demo: SnSegment — sm / md / lg presets (heroui 28 / 32 / 40 px). */
import { SnSegment } from '@snui/vue-web';

const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'reports', label: 'Reports' },
];
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <span class="demo-tag">sm</span>
      <SnSegment size="sm" :options="views" :model-value="'dashboard'" />
    </div>
    <div class="demo-row">
      <span class="demo-tag">md</span>
      <SnSegment size="md" :options="views" :model-value="'dashboard'" />
    </div>
    <div class="demo-row">
      <span class="demo-tag">lg</span>
      <SnSegment size="lg" :options="views" :model-value="'dashboard'" />
    </div>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
.demo-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.demo-tag {
  width: 20px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
