<script setup lang="ts">
/** Demo: SnQrCode — basic canvas rendering. */
import { SnQrCode } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnQrCode value="https://snail.aui" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: flex-start; }
</style>
