<script setup lang="ts">
/** Demo: SnUpload — beforeUpload & max. */
import { ref } from 'vue'
import { SnUpload } from '@snui/vue-web'
const count = ref(0)

function beforeUpload(file: File): boolean {
  const ok = file.size <= 1024 * 1024
  if (!ok) console.warn(`跳过 ${file.name}：超过 1MB`)
  return ok
}
</script>

<template>
  <div class="demo-col">
    <SnUpload :before-upload="beforeUpload" :max="3" @change="(list: unknown[]) => (count = list.length)" />
    <span class="demo-log">beforeUpload 拒绝 &gt;1MB；max=3 到界隐藏触发（当前 {{ count }}）</span>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-log { font-size: 13px; color: var(--vp-c-text-2); }
</style>
