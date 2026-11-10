<script setup lang="ts">
/** Demo: SnIcon (web-end) — size scale. */
import { Star } from 'lucide-vue-next';
import SnIcon from '@snui/vue-web-src/icon/SnIcon.vue';
</script>

<template>
  <div class="sn-demo">
    <SnIcon :icon="Star" :size="14" />
    <SnIcon :icon="Star" :size="18" />
    <SnIcon :icon="Star" :size="24" />
    <SnIcon :icon="Star" :size="32" />
    <SnIcon :icon="Star" :size="48" />
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
