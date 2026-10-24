<script setup lang="ts">
/** Demo: SnButton (Web) — circle / strong / secondary / tertiary / quaternary. */
import { SnButton } from '@snui/vue-web'
import { Mail, Plus } from 'lucide-vue-next'
</script>

<template>
  <div class="sn-demo">
    <SnButton circle type="primary" :icon="Mail" />
    <SnButton circle type="success" :icon="Plus" />
    <SnButton strong type="primary">Strong primary</SnButton>
    <SnButton secondary>secondary</SnButton>
    <SnButton tertiary type="primary">tertiary</SnButton>
    <SnButton quaternary>quaternary</SnButton>
  </div>
</template>

<style scoped>
.sn-demo { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
</style>