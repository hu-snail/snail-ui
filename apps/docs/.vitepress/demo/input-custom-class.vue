<script setup lang="ts">
/** Demo: SnInput — customClass on root. */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const a = ref('');
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="a" custom-class="my-input-root" placeholder="customClass on root" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
:deep(.my-input-root) {
  --sn-web-color-action-primary: #8b5cf6;
}
</style>
