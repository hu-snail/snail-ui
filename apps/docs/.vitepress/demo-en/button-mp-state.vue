<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — disabled & loading.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

const loading = ref(false)
function trigger(): void {
  loading.value = true
  setTimeout(() => { loading.value = false }, 1000)
}
</script>

<template>
  <div class="sn-demo">
    <SnButton disabled>Disabled</SnButton>
    <SnButton loading>Loading</SnButton>
    <SnButton :loading="loading" type="primary" @click="trigger">Click to trigger loading</SnButton>
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
