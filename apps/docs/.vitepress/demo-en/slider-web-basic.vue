<script setup lang="ts">
/** Demo: SnSlider — basic. */
import { ref } from 'vue';
import { SnSlider } from '@snui/vue-web';
const value = ref(36);
</script>

<template>
  <div class="demo-col">
    <SnSlider v-model="value" />
    <span class="demo-log">value = {{ value }}</span>
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
