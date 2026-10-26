<script setup lang="ts">
/**
 * Demo: SnIcon (web-end) — basic usage with named lucide imports.
 *
 * Demonstrates 按需加载 the recommended way: import only the icons you
 * actually use, pass each one to <SnIcon :icon="…" />. The bundler
 * statically analyzes the named imports below and only those four
 * icons end up in the production bundle.
 */
import { Camera, Heart, Settings, Trash } from 'lucide-vue-next'
import SnIcon from '@snui/vue-web-src/icon/SnIcon.vue'
</script>

<template>
  <div class="sn-demo">
    <SnIcon :icon="Camera" :size="24" />
    <SnIcon :icon="Heart" :size="24" color="#ef4444" />
    <SnIcon :icon="Settings" :size="24" />
    <SnIcon :icon="Trash" :size="24" color="#71717a" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 24px;
}
</style>