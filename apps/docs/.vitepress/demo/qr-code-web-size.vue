<script setup lang="ts">
/** Demo: SnQrCode — size controlled by stepper buttons. */
import { ref } from 'vue'
import { SnButton, SnQrCode } from '@snui/vue-web'

const size = ref(110)

function add(): void {
  size.value = Math.min(220, size.value + 10)
}

function minus(): void {
  size.value = Math.max(40, size.value - 10)
}
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnButton size="small" @click="minus">减 10</SnButton>
      <SnButton size="small" @click="add">加 10</SnButton>
    </div>
    <SnQrCode value="The rain dampened the sky" :size="size" />
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.demo-row { display: flex; gap: 8px; align-items: center; }
</style>
