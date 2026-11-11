<script setup lang="ts">
/** Demo: SnQrCode — multi-color module palette. */
import { SnFlex, SnQrCode } from '@snui/vue-web';
</script>

<template>
  <div class="demo-col">
    <SnFlex>
      <SnQrCode
        value="https://snail.aui"
        shape="rounded"
        :colors="['#18a058', '#2080f0', '#f0a020', '#d03050', '#722ed1']"
      />
      <SnQrCode
        value="https://snail.aui"
        shape="dot"
        :colors="['#18a058', '#36ad6a', '#5acea7', '#2080f0']"
      />
    </SnFlex>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
