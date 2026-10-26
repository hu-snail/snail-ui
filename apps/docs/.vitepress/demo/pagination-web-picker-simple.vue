<script setup lang="ts">
/** Demo: SnPagination — 条数切换 + 页码省略 + 简洁模式 + 自定义页码插槽。 */
import { SnPagination } from '@snui/vue-web';
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">条数切换 + 省略号</span>
      <SnPagination
        :default-page="8"
        :item-count="200"
        :page-sizes="[10, 20, 50]"
        show-size-picker
        show-quick-jumper
      />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">简洁模式</span>
      <SnPagination :default-page="2" :item-count="45" simple show-total />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">自定义页码插槽</span>
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
