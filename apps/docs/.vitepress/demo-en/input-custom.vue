<script setup lang="ts">
/** Demo: SnInput — customClass / customStyle / customInputClass + placeholderStyle. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'

const a = ref('')
const b = ref('')
const c = ref('')
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="a" custom-class="my-input-root" placeholder="customClass on root" />
    <SnInput
      v-model="b"
      placeholder="placeholderStyle (red, italic)"
      placeholder-style="color: #ef4444; font-style: italic;"
    />
    <SnInput
      v-model="c"
      custom-input-class="my-native-input"
      custom-style="border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,.15);"
      placeholder="customStyle + customInputClass"
    />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
:deep(.my-input-root) {
  --sn-web-color-action-primary: #8b5cf6;
}
:deep(.my-native-input) {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.02em;
}
</style>