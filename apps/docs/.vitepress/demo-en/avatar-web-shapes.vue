<script setup lang="ts">
/** Demo: SnAvatar — shapes & color. */
import { SnAvatar } from '@snui/vue-web'
</script>

<template>
  <div class="demo-row">
    <SnAvatar fallback-text="SN" round />
    <SnAvatar fallback-text="SN" circle color="#18a058" />
    <SnAvatar fallback-text="SN" color="#2080f0" size="large" />
  </div>
</template>

<style scoped>
.demo-row { display: flex; gap: 16px; align-items: center; }
</style>
