<script setup lang="ts">
/** Demo: SnInput — customStyle + placeholderStyle. */
import { ref } from 'vue';
import { SnInput } from '@snui/vue-web';

const b = ref('');
const c = ref('');
</script>

<template>
  <div class="sn-demo">
    <SnInput
      v-model="b"
      placeholder="placeholderStyle (red, italic)"
      placeholder-style="color: #ef4444; font-style: italic;"
    />
    <SnInput
      v-model="c"
      custom-style="border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,.15);"
      placeholder="customStyle on inner input"
    />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}
</style>
