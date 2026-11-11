<script setup lang="ts">
/**
 * skeleton-web-sharp — square and round corners.
 */
import { SnSkeleton } from '@snui/vue-web';
</script>

<template>
  <div class="sk-sharp">
    <div class="sk-sharp__group">
      <span class="sk-sharp__cap">直角 / 圆角</span>
      <SnSkeleton width="100%" height="40px" />
      <SnSkeleton width="100%" height="40px" :sharp="false" />
      <SnSkeleton width="100%" height="40px" round />
    </div>
  </div>
</template>

<style scoped>
.sk-sharp {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  width: 100%;
}
.sk-sharp__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 220px;
  min-width: 200px;
}
.sk-sharp__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
