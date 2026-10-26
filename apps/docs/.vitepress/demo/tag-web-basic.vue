<script setup lang="ts">
/** Demo: SnTag — basic types + sizes. */
import { SnTag } from '@snui/vue-web'
</script>

<template>
  <div class="demo-col">
    <div class="demo-row">
      <SnTag>default</SnTag>
      <SnTag type="primary">primary</SnTag>
      <SnTag type="info">info</SnTag>
      <SnTag type="success">success</SnTag>
      <SnTag type="warning">warning</SnTag>
      <SnTag type="error">error</SnTag>
    </div>
    <div class="demo-row">
      <SnTag size="small">small</SnTag>
      <SnTag size="medium">medium</SnTag>
      <SnTag size="large">large</SnTag>
    </div>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.demo-row { display: flex; gap: 8px; align-items: center; }
</style>
