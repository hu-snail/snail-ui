<script setup lang="ts">
/** Demo: SnSliderBar — leading / trailing edge icons. */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const volume = ref(40);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">头尾图标（leading-icon / trailing-icon）</span>
    <SnSliderBar
      v-model="volume"
      leading-icon="Volume1"
      trailing-icon="Volume2"
      label="音量"
      show-value
      aria-label="Volume"
    />
    <span class="demo-log">volume = {{ volume }}%</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 460px;
  padding: 12px 0;
}
.demo-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
