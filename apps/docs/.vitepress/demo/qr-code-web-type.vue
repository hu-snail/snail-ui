<script setup lang="ts">
/** Demo: SnQrCode — canvas vs svg render targets (both stay crisp). */
import { ref } from 'vue'
import { SnQrCode } from '@snui/vue-web'

const text = ref('雨淋湿了天空')
</script>

<template>
  <div class="demo-row">
    <SnQrCode :value="text" type="canvas" />
    <SnQrCode :value="text" type="svg" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: flex-start; }
</style>
