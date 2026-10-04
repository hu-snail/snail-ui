<script setup lang="ts">
/**
 * Demo: SnIcon (web-end) — size scale + stroke-width variants.
 */
import { Star } from 'lucide-vue-next'
import SnIcon from '@snui/vue-web-src/icon/SnIcon.vue'
</script>

<template>
  <div class="sn-demo">
    <SnIcon :icon="Star" :size="14" />
    <SnIcon :icon="Star" :size="18" />
    <SnIcon :icon="Star" :size="24" />
    <SnIcon :icon="Star" :size="32" />
    <SnIcon :icon="Star" :size="48" />
    <SnIcon :icon="Star" :size="32" :stroke-width="1" />
    <SnIcon :icon="Star" :size="32" :stroke-width="2" />
    <SnIcon :icon="Star" :size="32" :stroke-width="3" />
    <SnIcon :icon="Star" :size="32" stroke-width-absolute />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  color: #f59e0b;
}
</style>