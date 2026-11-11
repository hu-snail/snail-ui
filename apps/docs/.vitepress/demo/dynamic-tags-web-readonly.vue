<script setup lang="ts">
/** Demo: SnDynamicTags — readonly. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const a = ref(['只读标签']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="a" readonly />
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
