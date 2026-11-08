<script setup lang="ts">
/** Demo: SnDatePicker — monthrange (dual year | month panes). */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';

const months = ref<[number, number] | null>(null);
const preset = ref<[number, number] | null>([
  new Date(2007, 5, 1).getTime(),
  new Date(2026, 10, 1).getTime(),
]);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnDatePicker v-model="months" type="monthrange" clearable style="width: 320px" />
      <span class="demo-log">
        {{
          months
            ? months
                .map((v) => {
                  const d = new Date(v);
                  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                })
                .join(' ~ ')
            : '—'
        }}
      </span>
    </div>
    <div class="demo-row">
      <SnDatePicker v-model="preset" type="monthrange" clearable style="width: 320px" />
      <span class="demo-log">带初始值：可在面板中重新框选</span>
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
