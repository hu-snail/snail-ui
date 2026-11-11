<script setup lang="ts">
/** Demo: SnDynamicTags — max tag count. */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const a = ref(['上限一', '上限二', '上限三']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="a" :max="3" placeholder="已到上限" />
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
