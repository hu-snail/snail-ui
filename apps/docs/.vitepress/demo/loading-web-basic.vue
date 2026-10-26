<script setup lang="ts">
/**
 * loading-web-basic — the five built-in size tiers plus a numeric size.
 */
import { SnLoading } from '@snui/vue-web';
</script>

<template>
  <div class="loading-demo loading-demo--row">
    <SnLoading size="tiny" />
    <SnLoading size="small" />
    <SnLoading size="medium" />
    <SnLoading size="large" />
    <SnLoading size="huge" />
    <SnLoading :size="56" />
  </div>
</template>

<style scoped>
.loading-demo {
  display: flex;
  gap: 24px;
}
.loading-demo--row {
  align-items: center;
  flex-wrap: wrap;
}
</style>
