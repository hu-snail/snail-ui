<script setup lang="ts">
/** Demo: SnLoading — stroke recolours the arc. */
import { SnLoading } from '@snui/vue-web';
</script>

<template>
  <div class="loading-demo">
    <div class="loading-demo__row">
      <SnLoading stroke="var(--vp-c-brand-1)" size="large" />
    </div>
  </div>
</template>

<style scoped>
.loading-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.loading-demo__row {
  display: flex;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}
</style>
