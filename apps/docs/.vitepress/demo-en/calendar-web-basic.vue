<script setup lang="ts">
/** Demo: SnCalendar — basic month view with v-model:value, custom cells, disabled dates. */
import { ref } from 'vue';
import { SnCalendar } from '@snui/vue-web';

const value = ref<number>(Date.now() + 24 * 3600_000);

// Disable yesterday, like the reference basic demo.
function isDateDisabled(ts: number): boolean {
  const start = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  return (
    start.getFullYear() === yesterday.getFullYear() &&
    start.getMonth() === yesterday.getMonth() &&
    start.getDate() === yesterday.getDate()
  );
}
</script>

<template>
  <div class="sn-demo">
    <SnCalendar v-model:value="value" :is-date-disabled="isDateDisabled">
      <template #default="{ year, month, date }">
        <div class="sn-demo-cell">{{ year }}-{{ month }}-{{ date }}</div>
      </template>
    </SnCalendar>
    <p class="sn-demo-value">Currently selected timestamp: {{ value }}</p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 960px;
}

.sn-demo-cell {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
  line-height: 1.4;
}

.sn-demo-value {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
