<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — basic types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-button via easycom.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
</script>

<template>
  <div class="sn-demo">
    <SnButton>默认</SnButton>
    <SnButton type="primary">主要</SnButton>
    <SnButton type="success">成功</SnButton>
    <SnButton type="warning">警告</SnButton>
    <SnButton type="danger">危险</SnButton>
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
