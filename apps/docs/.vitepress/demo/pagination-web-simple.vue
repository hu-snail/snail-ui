<script setup lang="ts">
/** Demo: SnPagination — 简洁模式（simple + show-total）。 */
import { SnPagination } from '@snui/vue-web';
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">简洁模式</span>
      <SnPagination :default-page="2" :item-count="45" simple show-total />
    </div>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pagination-demo__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pagination-demo__label {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
