<script setup lang="ts">
/**
 * Demo: SnButton (Web) — block & round.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton block type="primary">Block button</SnButton>
    <SnButton round type="success">Pill</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
