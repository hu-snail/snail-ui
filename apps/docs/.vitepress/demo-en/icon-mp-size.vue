<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — size + stroke-width variants.
 */
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set'
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
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 32rpx;
  align-items: center;
  color: #f59e0b;
}
</style>