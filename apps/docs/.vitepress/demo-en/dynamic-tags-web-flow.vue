<script setup lang="ts">
/** Demo: SnDynamicTags — add flow keyboard. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const tags = ref<string[]>([]);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="tags" placeholder="Enter to commit · Esc to cancel · blur to commit" />
    <span class="demo-log">{{ tags.length }} tags</span>
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
