<script setup lang="ts">
/** Demo: SnDatePicker — datetime aside layout, shortcuts, disabledDate, select. */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const datetime = ref<number | null>(null);
const range = ref<[number, number] | null>(null);
const dynamicRange = ref<[number, number] | null>(null);
/** After the first pick only allow ends within ±7 days (onSelect pattern). */
const anchor = ref<number | null>(null);
function disabledDate(ts: number): boolean {
  if (anchor.value === null) return false;
  const week = 7 * 86_400_000;
  return ts < anchor.value - week || ts > anchor.value + week;
}
function onSelect(v: number | [number, number] | null): void {
  if (typeof v === 'number') anchor.value = v;
  else if (Array.isArray(v)) anchor.value = null;
}
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnDatePicker
        v-model="datetime"
        type="datetime"
        placeholder="Pick date & time"
        clearable
        style="width: 260px"
      />
      <span class="demo-log">{{ datetime ? new Date(datetime).toLocaleString() : '—' }}</span>
    </div>
    <div class="demo-row">
      <SnDatePicker
        v-model="range"
        type="datetimerange"
        :placeholder="['Start date', 'End date']"
        :shortcuts="[
          { label: 'Now', value: () => Date.now() },
          { label: 'In a week', value: () => Date.now() + 7 * 86400000 },
        ]"
        shortcuts-position="left"
        clearable
        style="width: 380px"
      />
    </div>
    <div class="demo-row">
      <SnDatePicker
        v-model="dynamicRange"
        type="daterange"
        :placeholder="['Start date', 'End date']"
        :disabled-date="disabledDate"
        @select="onSelect"
        clearable
        style="width: 320px"
      />
      <span class="demo-log">After the first pick only ±7 days are selectable</span>
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
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
