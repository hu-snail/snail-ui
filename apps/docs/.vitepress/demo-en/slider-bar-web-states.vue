<script setup lang="ts">
/** Demo: SnSliderBar — disabled / reverse axis. */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const volume = ref(64);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">disabled（禁用全部交互）</span>
    <SnSliderBar v-model="volume" show-value disabled aria-label="Disabled volume" />

    <span class="demo-label">reverse（翻转坐标轴）</span>
    <SnSliderBar v-model="volume" show-value reverse aria-label="Reversed volume" />

    <span class="demo-log">volume = {{ volume }}%</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
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
