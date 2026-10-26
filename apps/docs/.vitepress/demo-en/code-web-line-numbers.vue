<script setup lang="ts">
/** Demo: SnCode — line-number gutter aligned with the code rows. */
import { SnCode } from '@snui/vue-web'

const jsonCode = `{
  "service": "gateway",
  "port": 8080,
  "routes": ["/api", "/docs"],
  "verbose": false
}`
</script>

<template>
  <div class="sn-demo">
    <SnCode :code="jsonCode" language="json" show-line-numbers />
  </div>
</template>

<style scoped>
.sn-demo {
  color: var(--sn-web-color-text-primary);
}
</style>
