<script setup lang="ts">
/**
 * skeleton-web-repeat — multiple rows via `repeat`.
 */
import { SnSkeleton } from '@snui/vue-web';
</script>

<template>
  <div class="sk-repeat">
    <div class="sk-repeat__group">
      <span class="sk-repeat__cap">repeat 多行</span>
      <SnSkeleton :repeat="3" width="100%" />
    </div>
    <div class="sk-repeat__group">
      <span class="sk-repeat__cap">repeat 5 行</span>
      <SnSkeleton :repeat="5" width="60%" />
    </div>
  </div>
</template>

<style scoped>
.sk-repeat {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  width: 100%;
}
.sk-repeat__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 220px;
  min-width: 200px;
}
.sk-repeat__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
