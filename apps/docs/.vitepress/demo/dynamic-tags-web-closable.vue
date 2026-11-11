<script setup lang="ts">
/** Demo: SnDynamicTags — closable=false (tags cannot be removed). */
import { ref } from 'vue';
import { SnDynamicTags } from '@snui/vue-web';
const b = ref(['不可删']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicTags v-model="b" :closable="false" placeholder="添加" />
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
