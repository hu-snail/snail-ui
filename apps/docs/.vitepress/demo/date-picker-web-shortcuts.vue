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
        placeholder="请选择日期时间"
        clearable
        style="width: 260px"
      />
      <span class="demo-log">{{ datetime ? new Date(datetime).toLocaleString() : '—' }}</span>
    </div>
    <div class="demo-row">
      <SnDatePicker
        v-model="range"
        type="datetimerange"
        :placeholder="['开始日期', '结束日期']"
        :shortcuts="[
          { label: '此刻', value: () => Date.now() },
          { label: '一周后', value: () => Date.now() + 7 * 86400000 },
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
        :placeholder="['开始日期', '结束日期']"
        :disabled-date="disabledDate"
        @select="onSelect"
        clearable
        style="width: 320px"
      />
      <span class="demo-log">选起点后仅允许 ±7 天（onSelect + disabledDate）</span>
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
