<script setup lang="ts">
/** Demo: SnAlert — no title (body only): the title row is not rendered. */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-demo">
    <p class="alert-demo__label">无 title（仅正文）</p>
    <SnAlert type="warning">只有正文内容时，标题行不渲染。</SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.alert-demo__label {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
</style>
