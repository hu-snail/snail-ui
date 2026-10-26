<script setup lang="ts">
/** Demo: SnAutoComplete — keyboard flow (ArrowUp/Down + Enter + Esc). */
import { ref } from 'vue';
import { SnAutoComplete } from '@snui/vue-web';
const value = ref('');
const options = ['React', 'Vue', 'Svelte', 'Solid'];
</script>

<template>
  <div class="demo-col">
    <SnAutoComplete
      v-model="value"
      :options="options"
      placeholder="↑↓ 高亮，Enter 选中，Esc 关闭"
      style="width: 300px"
    />
    <span class="demo-log">试试：输入 v → ↑↓ → Enter</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
