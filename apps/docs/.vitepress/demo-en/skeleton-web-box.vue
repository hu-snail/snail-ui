<script setup lang="ts">
/**
 * skeleton-web-box — block placeholders for non-text geometry.
 *
 * Shows: bare boxes at explicit `width` / `height`, the three `size` tiers,
 * and a `repeat` row built from them.
 */
import { SnSkeleton } from '@snui/vue-web'
</script>

<template>
  <div class="sk-box">
    <div class="sk-box__group">
      <span class="sk-box__cap">Explicit size</span>
      <SnSkeleton width="180px" height="24px" />
      <SnSkeleton width="120px" height="64px" />
      <SnSkeleton width="240px" height="12px" />
    </div>

    <div class="sk-box__group">
      <span class="sk-box__cap">Three heights via size</span>
      <SnSkeleton size="small" width="100%" />
      <SnSkeleton size="medium" width="100%" />
      <SnSkeleton size="large" width="100%" />
    </div>

    <div class="sk-box__group">
      <span class="sk-box__cap">Multiple rows via repeat</span>
      <SnSkeleton :repeat="3" width="100%" />
    </div>

    <div class="sk-box__group">
      <span class="sk-box__cap">Square / rounded corners</span>
      <SnSkeleton width="100%" height="40px" />
      <SnSkeleton width="100%" height="40px" :sharp="false" />
      <SnSkeleton width="100%" height="40px" round />
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
