<script setup lang="ts">
/** Demo: SnInput — prefixIcon / suffixIcon via registry + cssIcon mode. */
import { ref } from 'vue'
import { SnInput } from '@snui/vue-web'
import { Search, AtSign, ChevronRight } from 'lucide-vue-next'
import { registerSnIcons } from '@snui/vue-web'

registerSnIcons({ Search, AtSign, ChevronRight })

const q = ref('')
const handle = ref('')
const url = ref('')
const cssClick = ref('')
</script>

<template>
  <div class="sn-demo">
    <SnInput v-model="q" placeholder="Search…" prefix-icon="Search" clearable />
    <SnInput v-model="handle" placeholder="@username" prefix-icon="AtSign" />
    <SnInput v-model="url" placeholder="https://" suffix-icon="ChevronRight" />
    <SnInput
      v-model="cssClick"
      placeholder="CSS-class icon (no registry)"
      :prefix-icon="'my-icon-glossary'"
      css-icon
    />
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 8px; max-width: 360px; }
:deep(.my-icon-glossary) {
  display: inline-flex;
  width: 14px;
  height: 14px;
  background: var(--sn-web-color-action-primary);
  border-radius: 50%;
}
</style>