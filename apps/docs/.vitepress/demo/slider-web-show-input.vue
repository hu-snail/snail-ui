<script setup lang="ts">
/** Demo: SnSlider — showInput number inputs (single + range). */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const v = ref(10);
const range = ref<[number, number]>([10, 42]);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="v" show-input />
    <SnSlider v-model="range" range show-input />
    <span class="demo-log">v = {{ v }} · range = {{ range.join(' – ') }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
