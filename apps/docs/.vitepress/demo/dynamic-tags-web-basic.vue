<script setup lang="ts">
/** Demo: SnDynamicTags — basic add / remove. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const tags = ref(['前端', 'Vue']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="tags" placeholder="添加标签" />
    <pre class="demo-log">{{ tags }}</pre>
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
  margin: 0;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
}
</style>
