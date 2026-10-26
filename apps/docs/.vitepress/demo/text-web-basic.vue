<script setup lang="ts">
/** Demo: SnText — basic + six types. */
import { SnText } from '@snui/vue-web'
</script>

<template>
  <div class="demo-col">
    <SnText>默认文本</SnText>
    <SnText type="primary">primary</SnText>
    <SnText type="info">info</SnText>
    <SnText type="success">success</SnText>
    <SnText type="warning">warning</SnText>
    <SnText type="error">error</SnText>
  </div>
</template>

<style scoped>
.demo-col { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
</style>
