<script setup lang="ts">
/** Demo: SnDynamicTags — disabled. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const b = ref(['禁用标签']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="b" disabled />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}
</style>
