<script setup lang="ts">
/** Demo: SnPagination — disabled 整体禁用 + pageSlot 收窄出现省略号对照。 */
import { Lock } from 'lucide-vue-next';
import { registerSnIcons, SnIcon, SnPagination } from '@snui/vue-web';

registerSnIcons({ Lock });
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">Default pageSlot (9) — all 8 pages spread out</span>
      <SnPagination :item-count="80" :default-page="3" />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label"
        >pageSlot narrowed to 5 — ends kept, middle folded into ellipses</span
      >
      <SnPagination :item-count="80" :default-page="4" :page-slot="5" />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label pagination-demo__label--icon">
        <SnIcon :icon="Lock" :size="14" />
        disabled disables everything (pages / jumper / page size all inert)
      </span>
      <SnPagination
        :item-count="80"
        :default-page="4"
        :page-slot="5"
        show-quick-jumper
        show-size-picker
        disabled
      />
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
