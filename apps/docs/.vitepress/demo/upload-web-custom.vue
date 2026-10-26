<script setup lang="ts">
/** Demo: SnUpload — customRequest state machine. */
import { ref } from 'vue';
import { SnUpload } from '@snui/vue-web';
import type { SnUploadFile } from '@snui/vue-web';

const logs = ref<string[]>([]);

async function customRequest(file: File): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (file.name.includes('fail')) {
    throw new Error('upload failed');
  }
}
</script>

<template>
  <div class="demo-col">
    <SnUpload
      :custom-request="customRequest"
      @change="(list: SnUploadFile[]) => (logs = list.map((f) => `${f.name}: ${f.status}`))"
    />
    <span class="demo-log">文件名带 "fail" 演示失败；其余 1.2s 后 done</span>
    <pre class="demo-log2">{{ logs.join('\n') }}</pre>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.demo-log2 {
  margin: 0;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  font-size: 12px;
  min-height: 20px;
}
</style>
