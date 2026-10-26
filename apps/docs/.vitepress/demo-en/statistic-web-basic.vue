<script setup lang="ts">
/** Demo: SnStatistic — basic label + value with prefix / suffix and default slot. */
import { Save } from 'lucide-vue-next';
import { registerSnIcons, SnIcon, SnStatistic } from '@snui/vue-web';

registerSnIcons({ Save });
</script>

<template>
  <div class="statistic-grid">
    <SnStatistic label="Statistics" :value="99">
      <template #prefix>
        <SnIcon :icon="Save" :size="16" />
      </template>
      <template #suffix>/ 100</template>
    </SnStatistic>
    <SnStatistic label="Active users"> 1,234,123 </SnStatistic>
  </div>
</template>

<style scoped>
.statistic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}
</style>
