<script setup lang="ts">
/**
 * Demo: SnButton (Web) — four sizes.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <SnButton size="tiny" type="primary">极小按钮</SnButton>
    <SnButton size="small" type="primary">小号按钮</SnButton>
    <SnButton size="medium" type="primary">中号按钮</SnButton>
    <SnButton size="large" type="primary">大号按钮</SnButton>
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
