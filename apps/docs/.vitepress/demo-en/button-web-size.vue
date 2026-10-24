<script setup lang="ts">
/**
 * Demo: SnButton (Web) — four sizes.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton size="tiny">tiny</SnButton>
    <SnButton size="small">small</SnButton>
    <SnButton size="medium">medium</SnButton>
    <SnButton size="large">large</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
