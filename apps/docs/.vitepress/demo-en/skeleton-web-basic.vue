<script setup lang="ts">
/**
 * skeleton-web-basic — line, block, circle and paragraph shapes.
 */
import { SnSkeleton } from '@snui/vue-web';
</script>

<template>
  <div class="sk-demo">
    <div class="sk-demo__row">
      <SnSkeleton text width="4em" />
      <SnSkeleton text width="8em" />
      <SnSkeleton text width="6em" />
    </div>

    <SnSkeleton height="24px" width="40%" />

    <div class="sk-demo__row sk-demo__row--avatar">
      <SnSkeleton circle :height="48" />
      <div class="sk-demo__stack">
        <SnSkeleton height="1em" width="60%" />
        <SnSkeleton height="1em" width="40%" />
      </div>
    </div>

    <SnSkeleton repeat="3" height="1em" />
  </div>
</template>

<style scoped>
.sk-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.sk-demo__row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sk-demo__row--avatar {
  align-items: center;
}
.sk-demo__stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
</style>
