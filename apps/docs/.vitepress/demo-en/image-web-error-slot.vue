<script setup lang="ts">
/** Demo: SnImage — error slot replaces the broken img; buttons toggle the source. */
import { ref } from 'vue'
import { SnButton, SnIcon, SnImage } from '@snui/vue-web'
import { ImageOff, RotateCw } from 'lucide-vue-next'

const BROKEN = 'This URL is guaranteed to fail'
const GOOD = 'https://picsum.photos/id/1024/400/300'
const url = ref(BROKEN)

function reload(): void {
  url.value = url.value === BROKEN ? GOOD : BROKEN
}
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnButton size="small" @click="reload">Toggle loading state</SnButton>
      <SnIcon :icon="RotateCw" :size="14" />
    </div>
    <SnImage width="120" height="90" :src="url">
      <template #error>
        <div class="error-box">
          <SnIcon :icon="ImageOff" :size="28" />
          <span>Load failed</span>
        </div>
      </template>
    </SnImage>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 24px; }
.demo-row { display: flex; gap: 8px; align-items: center; }
.error-box {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 90px;
  color: var(--sn-web-color-text-tertiary);
  background: color-mix(in srgb, var(--sn-web-color-text-primary) 4.5%, var(--sn-web-color-background-surface));
  border-radius: 3px;
  font-size: 12px;
}
</style>
