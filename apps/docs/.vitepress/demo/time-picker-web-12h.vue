<script setup lang="ts">
/** Demo: SnTimePicker — 12-hour mode. */
import { ref } from 'vue';
import { SnTimePicker } from '@snui/vue-web';
const value = ref<number | null>(new Date().setHours(14, 30, 0, 0));
</script>

<template>
  <div class="demo-row">
    <SnTimePicker v-model="value" use-12-hours />
    <span class="demo-log">{{ value }}</span>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  gap: 16px;
  align-items: center;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
