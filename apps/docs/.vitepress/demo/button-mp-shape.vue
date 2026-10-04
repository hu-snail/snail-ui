<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — block & round.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import { SnButton } from '@snui/uni'
</script>

<template>
  <div class="sn-demo">
    <SnButton block type="primary">块级按钮</SnButton>
    <SnButton round type="success">圆角</SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
