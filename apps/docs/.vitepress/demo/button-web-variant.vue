<script setup lang="ts">
/** Demo: SnButton (Web) — text / ghost / dashed variants. */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton text>Text</SnButton>
    <SnButton ghost type="primary">Ghost primary</SnButton>
    <SnButton ghost type="error">Ghost error</SnButton>
    <SnButton dashed>Dashed default</SnButton>
    <SnButton dashed type="primary">Dashed primary</SnButton>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
</style>