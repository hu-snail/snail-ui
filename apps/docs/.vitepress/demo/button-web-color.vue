<script setup lang="ts">
/** Demo: SnButton (Web) — custom color prop overrides type color. */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton color="#8b5cf6">Custom purple</SnButton>
    <SnButton color="#ec4899">Custom pink</SnButton>
    <SnButton color="#06b6d4" ghost>Custom cyan ghost</SnButton>
    <SnButton color="#10b981" tertiary>Custom emerald tertiary</SnButton>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
</style>