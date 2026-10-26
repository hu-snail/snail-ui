<script setup lang="ts">
/** Demo: SnLog — loading indicator pill. */
import { ref } from 'vue';
import { SnLog, SnSwitch } from '@snui/vue-web';

function makeLog(): string {
  const lines: string[] = [];
  for (let i = 0; i < 40; ++i) {
    lines.push(Math.random().toString(16));
  }
  return `${lines.join('\n')}\n`;
}

const loading = ref(false);
const log = ref(makeLog());
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__toolbar">
      <span class="sn-demo__label">loading</span>
      <SnSwitch v-model="loading" />
    </div>
    <SnLog :loading="loading" :log="log" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-primary);
}

.sn-demo__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sn-demo__label {
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
</style>
