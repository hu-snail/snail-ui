<script setup lang="ts">
/**
 * skeleton-web-box — block placeholders for non-text geometry.
 *
 * Shows: bare boxes at explicit `width` / `height`.
 */
import { SnSkeleton } from '@snui/vue-web';
</script>

<template>
  <div class="sk-box">
    <div class="sk-box__group">
      <span class="sk-box__cap">显式尺寸</span>
      <SnSkeleton width="180px" height="24px" />
      <SnSkeleton width="120px" height="64px" />
      <SnSkeleton width="240px" height="12px" />
    </div>
  </div>
</template>

<style scoped>
.sk-box {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  width: 100%;
}
.sk-box__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 220px;
  min-width: 200px;
}
.sk-box__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
