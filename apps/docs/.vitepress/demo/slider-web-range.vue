<script setup lang="ts">
/** Demo: SnSlider — range dual handles. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const range = ref<[number, number]>([20, 80]);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="range" range />
    <span class="demo-log">{{ range.join(' – ') }}</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
