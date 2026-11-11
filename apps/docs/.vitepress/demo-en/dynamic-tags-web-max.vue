<script setup lang="ts">
/** Demo: SnDynamicTags — max tag count. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const a = ref(['Limit one', 'Limit two', 'Limit three']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="a" :max="3" placeholder="Limit reached" />
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
