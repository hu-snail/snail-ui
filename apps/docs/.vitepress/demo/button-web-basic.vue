<script setup lang="ts">
/**
 * Demo: SnButton (Web) — basic types.
 * Per AUI-DOCS-016: imports the real @snui/vue-web SnButton.
 */
import { SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo">
    <SnButton>默认</SnButton>
    <SnButton type="primary">主要</SnButton>
    <SnButton type="success">成功</SnButton>
    <SnButton type="warning">警告</SnButton>
    <SnButton type="danger">危险</SnButton>
    <SnButton type="info">信息</SnButton>
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
