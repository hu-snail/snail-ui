<script setup lang="ts">
/** Demo: SnColorPicker — panel only (inline, no trigger). */
import { ref } from 'vue';
import { SnColorPicker } from '@snui/vue-web';
const color = ref('#2080f0');
const accent = ref('#12d2ac');
</script>

<template>
  <div class="sn-demo-color-picker-panel-only">
    <SnColorPicker v-model="color" panel-only />
    <SnColorPicker
      v-model="accent"
      panel-only
      :swatches="['#18a058', '#12d2ac', '#2080f0', '#f0a020', '#d03050', '#722ed1']"
    />
    <div class="sn-demo-color-picker-panel-only__values">
      <span>color: {{ color }}</span>
      <span>accent: {{ accent }}</span>
    </div>
  </div>
</template>

<style scoped>
.sn-demo-color-picker-panel-only {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.sn-demo-color-picker-panel-only__values {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-self: center;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--sn-web-color-text-secondary, #606266);
}
</style>
