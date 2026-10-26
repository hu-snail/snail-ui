<script setup lang="ts">
/** Demo: SnUpload — basic (no customRequest). */
import { ref } from 'vue';
import { SnUpload } from '@snui/vue-web';
import type { SnUploadFile } from '@snui/vue-web';
const files = ref<SnUploadFile[]>([]);
</script>

<template>
  <div class="demo-col">
    <SnUpload @change="(list: SnUploadFile[]) => (files = list)" />
    <span class="demo-log">{{ files.length }} 个文件</span>
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
</style>
