<script setup lang="ts">
/**
 * Demo: SnButton (Web) — block & round.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton block type="primary">块级按钮</SnButton>
    <SnButton round type="success">胶囊形</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
