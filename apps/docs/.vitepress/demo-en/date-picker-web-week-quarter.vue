<script setup lang="ts">
/** Demo: SnDatePicker — week / quarter types. */
import { ref } from 'vue';
import { SnDatePicker } from '@snui/vue-web';
const week = ref<number | null>(null);
const quarter = ref<number | null>(null);
const weekRange = ref<[number, number] | null>(null);
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnDatePicker
        v-model="week"
        type="week"
        placeholder="Pick a week"
        clearable
        style="width: 240px"
      />
      <span class="demo-log">{{ week ? new Date(week).toLocaleDateString() : '—' }}</span>
    </div>
    <div class="demo-row">
      <SnDatePicker
        v-model="quarter"
        type="quarter"
        placeholder="Pick a quarter"
        clearable
        style="width: 240px"
      />
      <span class="demo-log">{{ quarter ? new Date(quarter).toLocaleDateString() : '—' }}</span>
    </div>
    <div class="demo-row">
      <SnDatePicker
        v-model="weekRange"
        type="weekrange"
        :placeholder="['Start week', 'End week']"
        clearable
        style="width: 320px"
      />
      <span class="demo-log">
        {{ weekRange ? weekRange.map((v) => new Date(v).toLocaleDateString()).join(' ~ ') : '—' }}
      </span>
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
