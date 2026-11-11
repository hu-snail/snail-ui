<script setup lang="ts">
/** Demo: SnDynamicInput — readonly. */
import { ref } from 'vue';
import { SnDynamicInput } from '@snui/vue-web';
const b = ref<string[]>(['Structure frozen']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="b" readonly style="max-width: 360px" />
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
</style>
