<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — three sizes (no tiny on mobile).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <div class="sn-demo">
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
