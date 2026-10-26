<script setup lang="ts">
/** Demo: SnSpace — basic + sizes. */
import { SnButton, SnSpace } from '@snui/vue-web'
</script>

<template>
  <div class="demo-col">
    <SnSpace><SnButton>small</SnButton><SnButton>small</SnButton><SnButton>small</SnButton></SnSpace>
    <SnSpace size="large"><SnButton>large</SnButton><SnButton>large</SnButton><SnButton>large</SnButton></SnSpace>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
</style>
