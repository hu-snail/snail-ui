<script setup lang="ts">
/** Demo: SnDatePicker — inputPosition: default top vs bottom (input bar above / below the calendars). */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const topRange = ref<[number, number] | null>(null);
const bottomRange = ref<[number, number] | null>(null);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnDatePicker v-model="topRange" type="datetimerange" />
      <span class="demo-hint">default (top): input bar above the calendars</span>
    </div>
    <div class="demo-row">
      <SnDatePicker v-model="bottomRange" type="datetimerange" input-position="bottom" />
      <span class="demo-hint">input-position="bottom": input bar below the calendars (time popover opens upward)</span>
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
  gap: 16px;
  align-items: center;
}
.demo-hint {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
