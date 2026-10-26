<script setup lang="ts">
/**
 * Demo: SnButton (Web) — basic types.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton>Default</SnButton>
    <SnButton type="primary">Primary</SnButton>
    <SnButton type="success">Success</SnButton>
    <SnButton type="warning">Warning</SnButton>
    <SnButton type="danger">Danger</SnButton>
    <SnButton type="info">Info</SnButton>
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
