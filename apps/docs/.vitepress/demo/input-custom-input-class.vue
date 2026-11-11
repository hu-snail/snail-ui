<script setup lang="ts">
/** Demo: SnInput — customInputClass on the native input. */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const c = ref('');
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="c" custom-input-class="my-native-input" placeholder="customInputClass" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
:deep(.my-native-input) {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
}
</style>
