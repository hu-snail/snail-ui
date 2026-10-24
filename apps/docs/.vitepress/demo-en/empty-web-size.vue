<script setup lang="ts">
/** Demo: SnEmpty — five size steps. */
import { SnEmpty } from '@snui/vue-web'
</script>

<template>
  <div class="empty-demo">
    <div v-for="size in (['tiny', 'small', 'medium', 'large', 'huge'] as const)" :key="size" class="empty-demo__cell">
      <SnEmpty :size="size" :description="size" />
    </div>
  </div>
</template>

<style scoped>
.empty-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}
.empty-demo__cell {
  flex: 1;
  min-width: 120px;
  display: flex;
  justify-content: center;
}
</style>
