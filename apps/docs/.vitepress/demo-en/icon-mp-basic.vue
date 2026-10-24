<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — basic usage with shortcut IconData set.
 *
 * Each `import { X }` pulls in exactly one frozen IconData object.
 * The bundler statically analyzes the named imports below and only
 * those five icons end up in the production bundle — the other 18
 * in the shortcut set are tree-shaken.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import {
  ChevronRight,
  Heart,
  Search,
  Settings,
  Trash,
} from '@snui/uni-src/components/sn-icon/sn-icon-set'
</script>

<template>
  <div class="sn-demo">
    <SnIcon :icon="ChevronRight" :size="32" />
    <SnIcon :icon="Search" :size="32" />
    <SnIcon :icon="Settings" :size="32" />
    <SnIcon :icon="Heart" :size="32" color="#ef4444" />
    <SnIcon :icon="Trash" :size="32" color="#71717a" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
  align-items: center;
  font-size: 32rpx;
}
</style>