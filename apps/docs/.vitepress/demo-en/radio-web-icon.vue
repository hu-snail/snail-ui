<script setup lang="ts">
/** Demo: SnRadio — icon variant (icon-grid picker) with #icon slot glyphs. */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';
import { Sun, Moon, Cloud, Zap } from 'lucide-vue-next';

const picked = ref('sun');
</script>

<template>
  <SnRadioGroup v-model="picked" variant="icon" class="demo-tiles">
    <SnRadio checked-value="sun" aria-label="Sunny">
      <template #icon><Sun :size="22" /></template>
    </SnRadio>
    <SnRadio checked-value="moon" aria-label="Night">
      <template #icon><Moon :size="22" /></template>
    </SnRadio>
    <SnRadio checked-value="cloud" aria-label="Cloudy">
      <template #icon><Cloud :size="22" /></template>
    </SnRadio>
    <SnRadio checked-value="zap" aria-label="Storm">
      <template #icon><Zap :size="22" /></template>
    </SnRadio>
  </SnRadioGroup>
  <p class="demo-log">picked = {{ picked }}</p>
</template>

<style scoped>
.demo-tiles {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.demo-log {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
