<script setup lang="ts">
/** Demo: SnTimePicker — basic. */
import { ref } from 'vue';
import { SnTimePicker } from '@snui/vue-web';
const value = ref<number | null>(new Date().setHours(9, 30, 0, 0));
</script>

<template>
  <div class="demo-row">
    <SnTimePicker v-model="value" />
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
