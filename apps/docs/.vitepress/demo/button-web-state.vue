<script setup lang="ts">
/**
 * Demo: SnButton (Web) — disabled & loading.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { ref } from 'vue'
import { SnButton } from '@snui/vue-web'

const loading = ref(false)
function trigger(): void {
  loading.value = true
  setTimeout(() => { loading.value = false }, 1000)
}
</script>

<template>
  <div class="sn-demo">
    <SnButton disabled>禁用</SnButton>
    <SnButton loading>加载中</SnButton>
    <SnButton :loading="loading" type="primary" @click="trigger">点击触发加载</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
