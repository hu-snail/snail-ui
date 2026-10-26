<script setup lang="ts">
/** Demo: SnTag — shapes. */
import { SnTag } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnTag round>Pill tag</SnTag>
    <SnTag :bordered="false">Borderless</SnTag>
    <SnTag color="#722ed1">Custom color</SnTag>
    <SnTag disabled>Disabled tag</SnTag>
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 8px; align-items: center; }
</style>
