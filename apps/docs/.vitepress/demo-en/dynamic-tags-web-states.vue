<script setup lang="ts">
/** Demo: SnDynamicTags — disabled / readonly. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const a = ref(['Read-only tag']);
const b = ref(['Disabled tag']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="a" readonly />
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
