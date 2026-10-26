<script setup lang="ts">
/** Demo: SnUpload — beforeUpload & max. */
import { ref } from 'vue'
import { SnUpload } from '@snui/vue-web'
const count = ref(0)

function beforeUpload(file: File): boolean {
  const ok = file.size <= 1024 * 1024
  if (!ok) console.warn(`Skipped ${file.name}: over 1MB`)
  return ok
}
</script>

<template>
  <div class="demo-col">
    <SnUpload :before-upload="beforeUpload" :max="3" @change="(list: unknown[]) => (count = list.length)" />
    <span class="demo-log">beforeUpload rejects &gt;1MB; the trigger hides at max=3 (current: {{ count }})</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
