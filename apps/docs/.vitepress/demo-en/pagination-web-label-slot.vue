<script setup lang="ts">
/** Demo: SnPagination — 自定义页码插槽（#label）。 */
import { SnPagination } from '@snui/vue-web';
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">Custom page slot</span>
      <SnPagination :item-count="30">
        <template #label="{ page }">[{{ page }}]</template>
      </SnPagination>
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
